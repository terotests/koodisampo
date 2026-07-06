# Miten käynnistät uuden OS-säikeen std-kirjastolla?

## Taustaa

Rustin **`std::thread`**-moduuli tarjoaa pääsyn käyttöjärjestelmän natiiveihin säikeisiin (OS threads). Jokainen säie ajaa rinnakkain omassa call stackissaan. Tämä sopii CPU-raskaaseen työhön, jota haluat erottaa pääsäikeestä — esimerkiksi pitkä laskenta tai taustaprosessointi.

Säie ei jaa muistia automaattisesti turvallisesti: data siirretään `move`-closurella, jaetaan `Arc<Mutex<T>>`:n kautta tai lähetetään kanavalla. Rust varmistaa compile-time, että siirretty data on `Send`.

## Tilanne

Sovelluksessa on raskas laskenta, joka blokkaa pääsäikeen — esimerkiksi UI jäätyy tai palvelin ei vastaa muihin pyyntöihin:

```rust
fn heavy_compute() -> u64 {
    (0..10_000_000).map(|x| x * x).sum()
}

fn main() {
    let result = heavy_compute();  // kaikki muu odottaa
    println!("valmis: {}", result);
}
```

Haluat siirtää laskennan taustalle ja odottaa tulosta ennen jatkamista — ilman erillistä async-runtimea.

## Ratkaisu

Käytä `thread::spawn` ja `JoinHandle::join`:

```rust
use std::thread;

fn heavy_compute() -> u64 {
    (0..10_000_000).map(|x| x * x).sum()
}

fn main() {
    let handle = thread::spawn(|| {
        heavy_compute()
    });

    println!("Laskenta käynnissä taustalla...");
    let result = handle.join().unwrap();
    println!("Tulos: {}", result);
}
```

`spawn` palauttaa **`JoinHandle`**, jonka `join()` odottaa säikeen valmistumista ja palauttaa closuren paluuarvon. `unwrap()` käsittelee paniikin säikeessä — tuotannossa harkitse virheenkäsittelyä.

Jos closure sieppaa dataa ympäröivästä scopesta, tarvitset **`move`** ja `Send`:

```rust
let data = vec![1, 2, 3];
let handle = thread::spawn(move || {
    data.len()
});
```

## Käytännössä

Closure ja kaikki `move`-attribuutilla siirretyt arvot vaativat `'static` elinajan — ei viittauksia paikallisiin muuttujiin, jotka tuhoutuvat ennen säiettä. Jaettu tila: `Arc`, kanavat (`mpsc`) tai message passing Mutexin sijaan, kun mahdollista.

Useat säikeet: `Vec<JoinHandle<_>>` ja `join()` kaikille. I/O-painotteiseen rinnakkaisuuteen async (`tokio`) usein sopii paremmin; CPU-raskaaseen työhön `std::thread` on suoraviivainen aloitus.

[Lue lisää](https://doc.rust-lang.org/book/ch16-01-threads.html)

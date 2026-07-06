# Kaksi Mutex-lukitusta eri järjestyksessä kahdessa säikeessä — riski?

## Taustaa

Kun useat säikeet jakavat dataa `Mutex`-lukkojen kautta, jokaisen täytyy hankkia lukko ennen muokkausta. **Deadlock** syntyy, kun kaksi säiettä odottaa toistensa hallitsemia lukkoja — kumpikaan ei etene, ja ohjelma jää jumiin.

Rust estää **data racet** compile-time `Send`/`Sync`-säännöillä, mutta deadlock on ajonaikainen ongelma: kääntäjä ei voi havaita sitä. Lukitusjärjestys ja lukkojen määrä ovat suunnittelukysymyksiä, joista vastaa ohjelmoija.

## Tilanne

Kaksi jaettua resurssia: `Mutex<A>` ja `Mutex<B>`. Säie 1 lukitsee ensin A:n, sitten yrittää B:tä. Säie 2 tekee päinvastoin:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let a = Arc::new(Mutex::new(0));
let b = Arc::new(Mutex::new(0));

let a1 = Arc::clone(&a);
let b1 = Arc::clone(&b);
thread::spawn(move || {
    let _ga = a1.lock().unwrap();
    let _gb = b1.lock().unwrap();  // odottaa, jos toinen säie pitää b:tä
});

let a2 = Arc::clone(&a);
let b2 = Arc::clone(&b);
thread::spawn(move || {
    let _gb = b2.lock().unwrap();
    let _ga = a2.lock().unwrap();  // odottaa a:ta — klassinen deadlock
});
```

Jos molemmat säikeet saavat ensimmäisen lukon mutta odottavat toista samassa silmukassa, suoritus voi pysähtyä ikuisesti.

## Ratkaisu

**Yhtenäinen lukitusjärjestys** kaikissa säikeissä — aina A ennen B:

```rust
thread::spawn(move || {
    let _ga = a1.lock().unwrap();
    let _gb = b1.lock().unwrap();
});

thread::spawn(move || {
    let _ga = a2.lock().unwrap();  // sama järjestys: A ensin
    let _gb = b2.lock().unwrap();
});
```

Vaihtoehtoja: yhdistä tila yhdeksi `Mutex<(A, B)>`, käytä `try_lock()` ja peruuta toinen hankinta, tai vältä jaettua tilaa kanavien kautta. `Arc<Mutex<T>>` jakaa lukon useille säikeille — itse `Arc` ei lukitse, se vain jakaa omistajuuden.

## Käytännössä

Pidä lukkoja vähän ja elinajat lyhyinä: hanki lukko, tee muutos, pudota guard (`drop`) heti. `RwLock` sopii lukupainotteiseen dataan, mutta väärä lukitusjärjestys aiheuttaa deadlockin myös siinä.

Muista ero: **data race** = määrittelemätön käyttäytyminen jaetussa muistissa (Rust estää); **deadlock** = säikeet odottavat toisiaan loputtomasti (Rust ei estä). Suunnittele rinnakkaisuus niin, että tarvitset mahdollisimman vähän samanaikaisia lukkoja.

[Lue lisää](https://doc.rust-lang.org/book/ch16-03-shared-state.html)

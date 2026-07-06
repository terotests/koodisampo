# Jaat `Rc<T>` usean säikeen välillä — kääntäjä valittaa. Mikä tyyppi korvaa sen thread-safe -tilanteessa?

## Taustaa

Omistajuuden jakamiseen yhdessä säikeessä käytetään **`Rc<T>`** (reference counted). Se kasvattaa laskuria, kun viittauksia kloonataan, ja vapauttaa arvon, kun viimeinen `Rc` tuhoutuu. `Rc` ei ole thread-safe: sen sisäinen laskuri ei ole suojattu — samanaikainen käyttö eri säikeistä johtaisi data raceen.

Usean säikeen ympäristössä tarvitaan **`Arc<T>`** (Atomically Reference Counted). Atomiset operaatiot tekevät laskurin turvalliseksi säikeiden välillä. `Arc` jakaa **read-only** datan; muokattava jaettu tila vaatii lisäksi `Mutex` tai `RwLock`.

## Tilanne

Haluat jakaa konfiguraatio-olion usean worker-säikeen kesken:

```rust
use std::rc::Rc;
use std::thread;

let cfg = Rc::new(Config::default());
thread::spawn(move || {
    println!("{:?}", cfg);  // KÄÄNTÄJÄVIRHE: `Rc<Config>` cannot be sent between threads safely
});
```

`thread::spawn` vaatii, että closure on `Send` — omistajuus siirtyy uuteen säikeeseen. `Rc<T>` ei toteuta `Send`, koska laskuri ei kestä rinnakkaista käyttöä.

## Ratkaisu

Korvaa `Rc` → **`Arc`** ja kloonaa viite jokaiselle säikeelle:

```rust
use std::sync::Arc;
use std::thread;

let cfg = Arc::new(Config::default());
let cfg2 = Arc::clone(&cfg);

thread::spawn(move || {
    println!("{:?}", cfg2);
});

println!("{:?}", cfg);  // pääsäie säilyttää oman Arc:nsa
```

Jos dataa pitää **muokata** säikeiden välillä, yhdistä `Arc<Mutex<T>>` tai `Arc<RwLock<T>>`:

```rust
let shared = Arc::new(Mutex::new(Vec::new()));
let worker_data = Arc::clone(&shared);
thread::spawn(move || {
    worker_data.lock().unwrap().push(42);
});
```

`Arc` jakaa omistajuuden; `Mutex` / `RwLock` suojaa sisällön.

## Käytännössä

Yksittäisessä säikeessä tai puhtaasti synkronisessa koodissa `Rc` on kevyempi. Heti kun data menee `thread::spawn`:iin, kanavalle tai jaettuun runtimeen, käytä `Arc`.

`Send` ja `Sync` määrittävät tarkemmin, mitä saa siirtää ja jakaa — `Arc<T>` on `Send + Sync`, kun `T` on `Send + Sync`. Vähennä jaettua tilaa: kanavat (`mpsc`) siirtävät omistajuuden ilman jatkuvaa lukitusta.

[Lue lisää](https://doc.rust-lang.org/book/ch16-03-shared-state.html)

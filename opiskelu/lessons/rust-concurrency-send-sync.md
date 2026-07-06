# Jaat `Rc<T>` usean säikeen välillä — kääntäjä valittaa. Mikä tyyppi korvaa sen thread-safe -tilanteessa?

## Tilante

Haluat jakaa konfiguraatio-olion usean worker-säikeen kesken:

```rust
use std::rc::Rc;
use std::thread;

let cfg = Rc::new(Config::default());
thread::spawn(move || {
    println!("{:?}", cfg);  // KÄÄNTÄJÄVIRHE: Rc<T> cannot be sent between threads
});
```

`Rc<T>` kasvattaa referenssilaskuria, mutta se ei ole thread-safe.

## Ratkaisu

**`Arc<T>`** (Atomically Reference Counted) on `Rc`:n thread-safe vastine:

```rust
use std::sync::Arc;
use std::thread;

let cfg = Arc::new(Config::default());
let cfg2 = Arc::clone(&cfg);
thread::spawn(move || {
    println!("{:?}", cfg2);
});
// cfg kelpaa pääsäikeessä
```

Jos dataa pitää myös muokata säikeiden välillä, yhdistä **`Arc<Mutex<T>>`** tai **`Arc<RwLock<T>>`**: Arc jakaa omistajuuden, Mutex suojaa sisällön.

`Send` ja `Sync` -traitit määrittävät, mitä saa siirtää säikeisiin ja jakaa viittauksina.

## Käytännössä

Single-threaded: `Rc`. Multi-threaded: `Arc`. Sisäinen mutabiliteetti säikeissä: `Mutex` / `RwLock`. Kanaviviestintä (`mpsc`, `crossbeam`) vähentää jaetun tilan tarvetta.

[Lue lisää](https://doc.rust-lang.org/book/ch16-03-shared-state.html)

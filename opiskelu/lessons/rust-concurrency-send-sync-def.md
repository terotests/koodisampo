# Mikä ero `Send`- ja `Sync`-traitien välillä?

## Taustaa

Rustin säieturvallisuus perustuu kahteen **marker traitiin**, joita kääntäjä arvioi automaattisesti. **`Send`**: omistajuus tyyppiin `T` voidaan siirtää toiseen säikeeseen. **`Sync`**: jaettu viite `&T` on turvallinen usealle säikeelle samanaikaisesti.

Ne ovat "auto trait" -tyyppisiä: kääntäjä implinoi ne structeille ja closureille, jos kaikki kentät täyttävät ehdot. Et toteuta niitä itse — ymmärrät ne, kun `thread::spawn` tai `Arc` antaa virheen.

## Tilanne

Yrität siirtää `Rc<RefCell<T>>` closureen ja spawnata säikeen:

```rust
use std::rc::Rc;
use std::cell::RefCell;
use std::thread;

let data = Rc::new(RefCell::new(vec![1, 2, 3]));
thread::spawn(move || {
    data.borrow_mut().push(4);  // KÄÄNTÄJÄVIRHE
});
```

Virhe viittaa usein `Send`- tai `Sync`-rajoituksiin. `Rc` ei ole `Send` (laskuri ei thread-safe). `RefCell` ei ole `Sync` (sisäinen mutabiliteetti ei säieturvallinen jaetun viitteen kautta).

## Ratkaisu

**`Send`**: `T` on `Send`, kun voit `move`-ata arvon toiseen säikeeseen. Esimerkiksi `String`, `Vec<i32>` ja `Arc<Mutex<T>>` (kun `T` on `Send`) ovat `Send`.

**`Sync`**: `T` on `Sync`, kun `&T` voidaan jakaa säikeiden kesken turvallisesti. `Mutex<T>` tekee `T`:stä `Sync`-yhteensopivan jaetun viitteen kautta, vaikka `T` itself ei olisi `Sync`.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let data = Arc::new(Mutex::new(vec![1, 2, 3]));
let data2 = Arc::clone(&data);
thread::spawn(move || {
    data2.lock().unwrap().push(4);
}).join().unwrap();
```

Raw pointerit (`*const T`) eivät ole `Send` eivätkä `Sync` oletuksena — `unsafe`-koodissa vastuu siirtyy ohjelmoijalle.

## Käytännössä

`thread::spawn` vaatii `F: Send + 'static` — closure ja kaikki sen sieppaamat arvot on siirrettävä. Async-runtimessa `Future` usein vaatii `Send`, jotta tehtävä voidaan ajaa eri worker-säikeessä.

Kun kääntäjä sanoo "cannot be sent between threads safely", etsi kenttä, joka rikkoo `Send`:n. Kun jaettu viite ei kelpaa `Arc`:iin, tarkista `Sync`. Korvaa `Rc` → `Arc`, `RefCell` → `Mutex` tai `RwLock` rinnakkaisessa koodissa.

[Lue lisää](https://doc.rust-lang.org/book/ch16-04-extensible-concurrency-sync-and-send.html)

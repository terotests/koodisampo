# Monta säiettä lukee harvoin kirjoittavaa cachea. Mutex vs RwLock?

## Taustaa

`Mutex` sallii **yhden** säikeen kerrallaan — sekä luku että kirjoitus vaativat exclusive-lukon. **`RwLock`** (read-write lock) erottaa lukuoikeuden ja kirjoitusoikeuden: useat säikeet voivat lukea **samanaikaisesti**, mutta kirjoitus on yksinoikeudella.

Kun dataa luetaan usein ja päivitetään harvoin (konfiguraatio, cache, feature flag), `RwLock` voi parantaa rinnakkaisuutta. Lukijat eivät estä toisiaan, kun kukaan ei kirjoita.

## Tilanne

Sovelluksessa on jaettu konfiguraatio-cache. Jokainen HTTP-pyyntö lukee asetukset; admin-paneeli päivittää ne harvoin:

```rust
use std::sync::Mutex;

// Jokainen request: lock() — vain yksi lukija kerrallaan
let cache = Arc::new(Mutex::new(config));
```

`Mutex` toimii, mutta lukijat jonottavat turhaan toistensa takaa, vaikka kukaan ei muokkaisi dataa. 100 rinnakkaista lukijaa kilpailee yhdestä lukosta.

## Ratkaisu

Käytä `RwLock`: monta `read()`, yksi `write()` kerrallaan:

```rust
use std::sync::{Arc, RwLock};
use std::thread;

let cache = Arc::new(RwLock::new(config));

let cache_reader = Arc::clone(&cache);
thread::spawn(move || {
    let cfg = cache_reader.read().unwrap();
    println!("port = {}", cfg.port);
});

// Päivitys harvoin:
{
    let mut cfg = cache.write().unwrap();
    cfg.port = 9090;
}
```

`read()` palauttaa `RwLockReadGuard`, `write()` `RwLockWriteGuard`. Guard pudotetaan scope:n lopussa — sama RAII-malli kuin `Mutex`.

## Käytännössä

`RwLock` ei aina ole nopeampi: yksinkertainen `Mutex` voi voittaa, jos kirjoituksia on paljon tai lukitus on hyvin lyhyt. **Writer starvation** on mahdollista: jatkuva lukijavirta voi viivästyttää kirjoittajaa.

Aloita `Mutex`:llä; vaihda `RwLock`:iin, kun profilointi näyttää lukijaruuhkaa ja data on todella luku-painotteista. `Arc<RwLock<T>>` on yleinen yhdistelmä jaetuissa palveluissa — sama kuin `Arc<Mutex<T>>`, mutta eri lukitussäännöt.

[Lue lisää](https://doc.rust-lang.org/std/sync/struct.RwLock.html)

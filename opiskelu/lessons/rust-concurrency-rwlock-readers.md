# Monta säiettä lukee harvoin kirjoittavaa cachea. Mutex vs RwLock?

## Tilanne

Config-cache luetaan joka requestissa, päivitetään harvoin.

## Ratkaisu

```rust
let cache = Arc::new(RwLock::new(config));
let r = cache.read().unwrap();
// write() exclusive
```

## Käytännössä

Writer starvation mahdollinen. sometimes Mutex yksinkertaisempi.

[Lue lisää](https://doc.rust-lang.org/std/sync/struct.RwLock.html)

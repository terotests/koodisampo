# Jaettu tila async-tehtävissä — `std::sync::Mutex` aiheuttaa blokkausta awaitin yli. Mikä korvaaja?

## Tilanne

Useat tokio::spawn-tehtävät päivittävät samaa counter-structia.

## Ratkaisu

```rust
let state = Arc::new(tokio::sync::Mutex::new(AppState::default()));
let mut guard = state.lock().await;
guard.count += 1;
```

## Käytännössä

RwLock, Semaphore, Notify samassa moduulissa. Vältä lockin pitämistä await-yli.

[Lue lisää](https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html)

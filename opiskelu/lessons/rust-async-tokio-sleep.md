# async-funktiossa tarvitset viiveen. Miksi `std::thread::sleep` on huono valinta?

## Tilanne

Retry-logiikka odottaa 500 ms ennen uutta yritystä async HTTP-kutsussa.

## Ratkaisu

```rust
use tokio::time::{sleep, Duration};
for attempt in 0..3 {
    if try_request().await.is_ok() { break; }
    sleep(Duration::from_millis(500)).await;
}
```

## Käytännössä

interval() toistuviin ajastuksiin. timeout() wrapper selectin sijaan.

[Lue lisää](https://docs.rs/tokio/latest/tokio/time/fn.sleep.html)

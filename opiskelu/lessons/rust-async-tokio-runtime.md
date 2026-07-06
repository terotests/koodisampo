# async main ei käänny ilman runtimea. Mikä on tyypillinen tokio-käynnistys?

## Tilanne

`cargo run` — `async fn main()` antaa E0752 ilman runtime-makroa.

## Ratkaisu

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    fetch("https://...").await?;
    Ok(())
}
```

## Käytännössä

Library: älä tokio::main — palauta Future. spawn, select!, timeout tokiossa.

[Lue lisää](https://docs.rs/tokio/latest/tokio/attr.main.html)

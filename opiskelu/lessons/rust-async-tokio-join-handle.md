# tokio::spawn palauttaa JoinHandle<T>. Miten saat tehtävän tuloksen tai virheen?

## Tilanne

Spawnattu laskenta palauttaa arvon — päätehtävä tarvitsee tuloksen ennen vastausta.

## Ratkaisu

```rust
let handle = tokio::spawn(async { compute().await });
match handle.await {
    Ok(val) => println!("{val}"),
    Err(e) => eprintln!("task failed: {e}"),
}
```

## Käytännössä

JoinSet kerää useita handleja. abort() peruuttaa tehtävän.

[Lue lisää](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html)

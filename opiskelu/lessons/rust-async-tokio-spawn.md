# async fn:ssä haluat ajaa toisen async-tehtävän taustalla saman runtime:n alla. Mikä tokio-API?

## Tilanne

HTTP-palvelu käsittelee pyynnön mutta haluaa kirjata lokit taustalla ilman viivettä.

## Ratkaisu

```rust
let handle = tokio::spawn(async move {
    log_to_db(entry).await;
});
// voit await handle tai fire-and-forget
```
Spawnattu tehtävä on `Send + 'static`.

## Käytännössä

spawn_blocking siirtää CPU-raskaat synkroniset työt erilliselle poolille.

[Lue lisää](https://docs.rs/tokio/latest/tokio/fn.spawn.html)

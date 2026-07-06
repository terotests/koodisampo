# Mitä `async fn` palauttaa Rustissa?

## Tilanne

Verkko-IO odottaa — blocking säie kuluttaa thread poolin.

## Ratkaisu

```rust
async fn fetch(url: &str) -> Result<String, Error> {
    let body = client.get(url).await?.text().await?;
    Ok(body)
}
```

## Käytännössä

Tarvitsee executorin (tokio, async-std). async ≠ parallel — concurrent IO.

[Lue lisää](https://doc.rust-lang.org/book/ch17-01-futures-and-syntax.html)

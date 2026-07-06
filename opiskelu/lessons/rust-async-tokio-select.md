# Odotat useaa Futurea — ensimmäinen valmis voittaa (timeout, cancel). Mikä tokio-makro?

## Tilanne

WebSocket-yhteys odottaa viestiä tai 30 s timeoutia — kumpi tulee ensin.

## Ratkaisu

```rust
tokio::select! {
    msg = socket.recv() => handle(msg?),
    _ = tokio::time::sleep(Duration::from_secs(30)) => timeout(),
}
```

## Käytännössä

Peruutuksen pattern: `let abort = tokio::spawn(...); select! { _ = abort => {} }`.

[Lue lisää](https://docs.rs/tokio/latest/tokio/macro.select.html)

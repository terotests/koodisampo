# Async-tehtävät viestivät toisilleen tokio-runtime:ssa. Mikä kanava on async-native?

## Tilanne

Producer-task lähettää töitä worker-poolille async-palvelussa.

## Ratkaisu

```rust
let (tx, mut rx) = tokio::sync::mpsc::channel(32);
tokio::spawn(async move { tx.send(job).await.unwrap(); });
while let Some(job) = rx.recv().await { process(job).await; }
```

## Käytännössä

broadcast monelle subscriberille. oneshot yksittäiseen vastaukseen.

[Lue lisää](https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html)

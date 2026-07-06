# CLI-työkalu ajaa yhden async-mainin ilman rinnakkaisia worker-säikeitä. Mikä #[tokio::main] asetus?

## Tilanne

Yksinkertainen async fetch -CLI — multi-thread runtime tuntuu ylimitoitetulta.

## Ratkaisu

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() { ... }
```
Multi-thread oletus IO-painotteiseen palveluun.

## Käytännössä

worker_threads = N säätää poolin. Runtime builder advanced käyttöön.

[Lue lisää](https://docs.rs/tokio/latest/tokio/attr.main.html)

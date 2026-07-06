# Tuotantobinary on liian hidas debug-buildista. Mikä Cargo-komento?

## Tilanne

Benchmark debug-buildilla — 10x hitaampi kuin odotettu.

## Ratkaisu

```bash
cargo build --release
cargo run --release
```
Lto, codegen-units [profile.release]-säädöillä.

## Käytännössä

CI: erilliset test (debug) ja bench (release) jobit.

[Lue lisää](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html#building-to-release)

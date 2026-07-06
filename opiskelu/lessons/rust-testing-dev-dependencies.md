# mockall ja tokio-test dev-testeissä — minne Cargo.toml riippuvuus?

## Tilanne

mockall kasvattaa release-binääriä — se pitäisi olla vain testeissä.

## Ratkaisu

```toml
[dev-dependencies]
tokio = { version = "1", features = ["rt", "macros"] }
mockall = "0.13"
proptest = "1"
```

## Käytännössä

cargo build --release ei linkitä dev-deps. cargo test kyllä.

[Lue lisää](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#development-dependencies)

# mockall ja tokio-test dev-testeissä — minne Cargo.toml riippuvuus?

## Taustaa

Cargo erottaa riippuvuudet kolmeen osioon: **`[dependencies]`** (tuotantokoodi), **`[dev-dependencies]`** (vain testit ja esimerkit) ja **`[build-dependencies]`** (build-skriptit). Dev-dependencies linkitetään vain `cargo test`, `cargo bench` ja doc-testien yhteydessä — **ei** tavalliseen `cargo build --release` -binaryyn.

Tämä pitää tuotantobinaryn kevyenä: testauskirjastot (mockall, proptest, tokio-test-macrot) eivät kasvata deployattavan ohjelman kokoa eivätkä lisää turhia riippuvuuksia tuotantoon. Kehittäjät ja CI saavat silti täyden testausstackin.

## Tilanne

Lisäät `mockall`-mockauksen yksikkötesteihin ja `#[tokio::test]`-makron async-testeihin. Riippuvuudet lisätään vahingossa `[dependencies]`-osioon — release-binary kasvaa, compile-aika hidastuu ja turhat kirjastot voivat päätyä tuotantoon. Tiimi haluaa varmistaa, että testausvälineet pysyvät erillään.

```toml
[dependencies]
mockall = "0.13"   # väärä paikka — kuuluu dev-dependenciesiin
```

## Ratkaisu

Sijoita testausriippuvuudet `[dev-dependencies]`-osioon:

```toml
[dependencies]
reqwest = { version = "0.12", features = ["json"] }

[dev-dependencies]
tokio = { version = "1", features = ["rt", "macros"] }
mockall = "0.13"
proptest = "1"
```

Käyttö testissä toimii normaalisti:

```rust
#[cfg(test)]
mod tests {
    use mockall::automock;
    // ...
}

#[tokio::test]
async fn async_test_works() {
    assert_eq!(2 + 2, 4);
}
```

Varmista:

```bash
cargo build --release   # ei linkitä mockall/tokio-test
cargo test              # linkittää dev-dependencies
```

## Käytännössä

`cargo tree -e dev` näyttää dev-riippuvuuspuun. Doc-testit (`cargo test --doc`) käyttävät myös dev-dependencies — jos doc-esimerkit tarvitsevat kirjaston, se kuuluu dev-depsiin.

Integraatiotestit `tests/`-hakemistossa näkevät sekä `[dependencies]` että `[dev-dependencies]`. Jos testausapuja tarvitaan useassa testitiedostossa, luo `tests/common/mod.rs` — mutta älä julkaise sitä tuotantokoodissa.

[Lue lisää](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#development-dependencies)

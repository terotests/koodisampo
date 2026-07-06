# Haluat testata kirjastoa ulkoisena asiakkaana (public API). Minne integration testit?

## Tilanne

Yksikkötestit moduulissa, mutta tarvitset testin joka importtaa crate:n kuten ulkoinen käyttäjä.

## Ratkaisu

```rust
// tests/api_smoke.rs
use mycrate::Client;
#[test]
fn connects() { let c = Client::new(); assert!(c.ping()); }
```

## Käytännössä

tests/common/mod.rs jaettuihin apufunktioihin. cargo test ajaa unit + integration.

[Lue lisää](https://doc.rust-lang.org/book/ch11-03-test-organization.html)

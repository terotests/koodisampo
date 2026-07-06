# Haluat testata kirjastoa ulkoisena asiakkaana (public API). Minne integration testit?

## Taustaa

Rust erottaa **yksikkötestit** (unit tests) ja **integraatiotestit** (integration tests) selkeästi. Yksikkötestit elävät lähdekoodin vieressä `#[cfg(test)]`-moduulissa — ne voivat testata private-funktioita ja sisäistä rakennetta. Integraatiotestit simuloivat **ulkopuolista käyttäjää**, joka näkee vain julkisen API:n (`use mycrate::...`).

Integraatiotestit sijoitetaan projektin juureen **`tests/`**-hakemistoon. Jokainen `.rs`-tiedosto on erillinen crate, joka linkitetään kirjastoon. Cargo ajaa ne automaattisesti `cargo test` -komennolla yksikkötestien jälkeen.

## Tilanne

Kirjastosi `Client`-tyyppi tarvitsee testin, joka käyttää sitä kuten ulkoinen sovellus: importtaa crate:n nimellä, luo clientin ja kutsuu julkisia metodeja. Yksikkötestit moduulin sisällä eivät riitä — ne eivät pakota testaamaan julkista rajapintaa kokonaisuutena.

```rust
// src/client.rs — yksikkötestit näkevät private-apufunktiot
// Tarvitaan testi, joka näkee vain pub API:n
```

## Ratkaisu

Luo integraatiotesti `tests/`-hakemistoon:

```rust
// tests/api_smoke.rs
use mycrate::Client;

#[test]
fn client_pings_successfully() {
    let client = Client::new("http://localhost:8080");
    assert!(client.ping().is_ok());
}

#[test]
fn client_rejects_empty_url() {
    let result = Client::new("");
    assert!(result.is_err());
}
```

Jaetut apufunktiot testien välillä:

```rust
// tests/common/mod.rs  (ei suorita testejä — mod.rs)
pub fn test_config() -> Config { /* ... */ }

// tests/integration.rs
mod common;
use common::test_config;
```

**Huom:** `tests/common/mod.rs` ei ole automaattinen testitiedosto — vain `tests/*.rs` (ei alihakemiston mod.rs) ajetaan suoraan.

## Käytännössä

`cargo test` ajaa yksikkö-, integraatio- ja doc-testit. Suodata: `cargo test api_smoke`. Integraatiotestit voivat käyttää `[dev-dependencies]`-kirjastoja (mockall, tempfile).

Raja yksikkö- vs integraatiotesteille: yksikkö = yksittäinen funktio/moduuli, nopea, private OK. Integraatio = useita moduuleja, julkinen API, hitaampi (I/O, verkko). Älä testaa kaikkea integraatiotesteissä — pidä ne smoke- ja end-to-end -tasolla.

[Lue lisää](https://doc.rust-lang.org/book/ch11-03-test-organization.html)

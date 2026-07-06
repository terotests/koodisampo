# Haluat valinnaisen JSON-tuen riippuvuudessa ilman pakottamaan kaikille. Miten?

## Taustaa

Rust-kirjastot jaetaan **crateina**, joilla on omat riippuvuudet. Kaikki käyttäjät eivät tarvitse samaa toiminnallisuutta — HTTP-clientti, JSON-serialisointi tai tietokantatuki kasvattavat käännösaikaa, binary-kokoa ja riippuvuuksien pintaa. Cargo **featuret** mahdollistavat valinnaisen toiminnallisuuden compile-time-valintana.

Feature on boolean-lippu `Cargo.toml`:ssa. Koodi voi olla ehdollisesti mukana `#[cfg(feature = "json")]` -attribuutilla. Oletusfeaturet (`default`) määrittävät, mitä `cargo build` ilman flagia sisältää.

## Tilanne

Kirjastosi tarjoaa ydin-API:n kevyesti, mutta HTTP-integraatio vaatii `hyper`-riippuvuuden. Kaikki downstream-käyttäjät eivät tarvitse HTTP:tä — pakottaminen kasvattaisi heidän binaryaan turhaan. Tarvitset tavan sanoa: "HTTP on valinnainen, ota se käyttöön `--features http`-flagilla".

```toml
# Ilman featureja hyper olisi pakollinen [dependencies]-osiossa
```

## Ratkaisu

Määritä featuret `Cargo.toml`:ssa:

```toml
[features]
default = []
http = ["dep:hyper", "dep:http-body-util"]
json = ["dep:serde_json"]

[dependencies]
serde = { version = "1", optional = true }
hyper = { version = "1", optional = true }
serde_json = { version = "1", optional = true }
```

Käyttö:

```bash
cargo build                    # vain ydin, ei HTTP/JSON
cargo build --features http    # HTTP-tuki mukana
cargo build --all-features     # kaikki featuret (CI-testaukseen)
```

Koodissa ehdollinen moduuli:

```rust
#[cfg(feature = "json")]
pub mod json_support {
    pub fn parse(s: &str) -> serde_json::Value { /* ... */ }
}
```

## Käytännössä

Featuret ketjuttuvat: `full = ["http", "json"]`. Riippuvuuksien välillä: `http = ["dep:hyper"]` aktivoi optional-dependencyn. **Älä** käytä featureja runtime-valintaan — ne ovat compile-time. Runtime-valintaan sopii trait + dynaaminen dispatch.

Dokumentoi featuret README:ssa ja `Cargo.toml`-kommenteissa. CI:ssä testaa sekä `default` että `--all-features` — regressiot valinnaisissa poluissa ovat yleisiä.

[Lue lisää](https://doc.rust-lang.org/cargo/reference/features.html)

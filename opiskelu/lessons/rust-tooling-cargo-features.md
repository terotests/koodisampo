# Haluat valinnaisen JSON-tuen riippuvuudessa ilman pakottamaan kaikille. Miten?

## Tilanne

Kirjasto tukee HTTP:ä vain `http` featurella — default kevyempi.

## Ratkaisu

```toml
[features]
default = []
http = ["dep:hyper"]
```
`cargo build --features http`

## Käytännössä

#[cfg(feature = "json")] mod json; — compile-time stripping.

[Lue lisää](https://doc.rust-lang.org/cargo/reference/features.html)

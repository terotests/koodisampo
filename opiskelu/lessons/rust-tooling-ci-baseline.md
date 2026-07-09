# Mikä on järkevä minimiputki Rust-projektin CI:ssä?

## Taustaa

Rust-projektin laatu rakentuu työkaluketjuun: muotoilu, lint, testit, dokumentaatio ja dependency-turvallisuus. Clippy-kohdassa mainitaan `cargo clippy -- -D warnings`, mutta kokonainen CI-baseline auttaa tiimiä aloittamaan oikein ilman että jokainen projekti keksii putken uudelleen.

## Tilanne

Uusi palvelurepo buildaa ja testaa manuaalisesti ennen mergeä. Ensimmäinen tuotantoon mennyt versio sisältää Clippy-varoituksia, rikkinäisen doc-esimerkin ja haavoittuvan transitiivisen craten — koska CI:ssä ajettiin vain `cargo build`.

## Ratkaisu

Hyvä minimiputki:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
cargo doc --no-deps
cargo audit   # tai: cargo deny check
```

- **fmt --check** — yhtenäinen tyyli, ei yllätyksiä PR:ssä
- **clippy** — yleiset virheet ja tehottomuudet virheinä (`-D warnings`)
- **test** — yksikkö-, integraatio- ja doc-testit
- **doc** — `///`-esimerkit kääntyvät
- **audit/deny** — tunnetut CVE:t dependency-puussa

`-D warnings` on hyvä tiimiprojekteissa, mutta ota se käyttöön tietoisesti. Toolchain-päivitys voi tuoda uusia Clippy-varoituksia ja rikkoa CI:n — päivitä Rust-versio erillisellä PR:llä.

## Käytännössä

Lisää `cargo build --locked` varmistaaksesi, että `Cargo.lock` on ajan tasalla. Nopeuta CI:tä välimuistilla (`sccache`, `Swatinem/rust-cache`).

Pre-commit: `cargo fmt` + `cargo clippy` paikallisesti. Dokumentoi poikkeukset `#[allow(clippy::...)]` vain perustellusti. Laajenna vähitellen: `miri` (unsafe), `cargo fuzz` (kriittiset parserit).

[Lue lisää](https://doc.rust-lang.org/clippy/continuous_integration/index.html)

# Kirjastossa palautetaan `anyhow::Result`. Miksi code review vastustaa?

## Taustaa

Rust tarjoaa useita tapoja mallintaa virheitä: oma `enum`, `Box<dyn Error>`, **`thiserror`** (kirjasto-API:in virhe-enumit) ja **`anyhow`** (sovellustason konteksti ja raportointi). Valinta vaikuttaa siihen, voiko kutsuja matchata virhetyyppejä ja rakentaa luotettavaa domain-logiikkaa.

`anyhow` on erinomainen binääreissä ja CLI:ssä. Kirjaston public API:ssa se voi olla huono, koska kutsuja ei voi helposti erotella virhetilanteita.

## Tilanne

Julkaistava crate palauttaa kaikki virheet `anyhow::Result`:ina:

```rust
// lib.rs — public API
pub async fn fetch_user(id: u64) -> anyhow::Result<User> {
    let row = db::query(id).await?;
    parse_user(&row).context("invalid user row")?
}
```

Sovellus haluaa käsitellä `UserNotFound` eri tavalla kuin `DatabaseError` — mutta `anyhow::Error` on läpinäkyvä ketju ilman eksplisiittisiä variantteja. Domain-logiikka jää `if err.to_string().contains("not found")` -tasolle.

## Ratkaisu

Nyrkkisääntö:

- **binääri / CLI / app layer**: `anyhow::Result` + `.context()` rikastukseen
- **kirjasto / domain API**: oma virhe-enum + `thiserror::Error`
- **käyttäjälle näkyvät virheet**: älä paljasta sisäistä error chainia sellaisenaan

```rust
#[derive(Debug, thiserror::Error)]
pub enum UserError {
    #[error("user {0} not found")]
    NotFound(u64),
    #[error("database error")]
    Database(#[from] sqlx::Error),
}

pub async fn fetch_user(id: u64) -> Result<User, UserError> { ... }
```

Sovelluskerros mapittaa `UserError` → HTTP-status ja käyttäjäystävällisen viestin.

## Käytännössä

`thiserror` generoi `Display` ja `From`-toteutukset. `anyhow` sopii `main`:iin ja rajapintakerrokseen, jossa virheen tyyppi ei ole osa julkista sopimusta.

Älä sekoita tasoja: domain palauttaa tyypitetyn virheen, HTTP-handler kääntää sen vastaukseksi. Testaa virhepolkuja matchaamalla enum-variantteja — ei merkkijonoja.

[Lue lisää](https://docs.rs/thiserror/latest/thiserror/)

# Funktio palauttaa `Result<T, E>`. Mitä `?`-operaattori tekee Err-haarassa?

## Tilanne

Funktio ketjuttaa useita operaatioita, joista jokainen voi epäonnistua:

```rust
fn read_and_parse(path: &str) -> Result<Config, Error> {
    let text = std::fs::read_to_string(path)?;  // ?
    let cfg = toml::from_str(&text)?;            // ?
    Ok(cfg)
}
```

Ilman `?`:ä jokainen kutsu vaatisi `match` tai `if let Err` -toistoa.

## Ratkaisu

**`?`-operaattori** purkaa `Result`-arvon:

- `Ok(v)` → palauttaa `v` jatkoon
- `Err(e)` → **palauttaa heti** `Err(e)` funktiosta (early return)

```rust
// Sama ilman ?:
let text = match std::fs::read_to_string(path) {
    Ok(t) => t,
    Err(e) => return Err(e.into()),
};
```

`?` toimii vain funktioissa, joiden paluutyyppi on `Result` (tai `Option`). Virhetyypin on oltava muunnettavissa funktion `E`:ksi (`From`-trait).

## Käytännössä

`main`-funktiossa voi käyttää `fn main() -> Result<(), Box<dyn Error>>` ja ketjuttaa `?`:llä. Älä sekoita `?`:ää ja `.unwrap()` — unwrap panikoi, `?` propagoi virheen hallitusti.

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

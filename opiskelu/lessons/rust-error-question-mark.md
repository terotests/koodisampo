# Funktio palauttaa `Result<T, E>`. Mitä `?`-operaattori tekee Err-haarassa?

## Taustaa

**`Result<T, E>`** pakottaa käsittelemään virheet eksplisiittisesti — toisin kuin poikkeukset, joita voi unohtaa `catch`-lohkon. Kun funktio ketjuttaa useita riskialttiita operaatioita, toistuva `match` tai `if let Err` -koodi kasvaa nopeasti.

**`?`-operaattori** (question mark) on syntaktinen sokeri early returnille: se purkaa `Ok`-arvon jatkoon tai **palauttaa heti** `Err`-arvon funktiosta. Se toimii vain funktioissa, joiden paluutyyppi on `Result` (tai `Option`), ja vaatii että virhetyypit ovat muunnettavissa **`From`-traitin** kautta.

`?` tekee virheketjusta luettavan pystysuuntaisen "onnistumispolun" — onnistuneet vaiheet etenevät, virheet bubble up automaattisesti.

## Tilanne

Funktio lukee konfiguraation tiedostosta ja parsii sen:

```rust
fn read_and_parse(path: &str) -> Result<Config, Error> {
    let text = std::fs::read_to_string(path)?;  // ?
    let cfg = toml::from_str(&text)?;            // ?
    Ok(cfg)
}
```

Ilman `?`:ä jokainen kutsu vaatii erillisen virhehaaran:

```rust
let text = match std::fs::read_to_string(path) {
    Ok(t) => t,
    Err(e) => return Err(e.into()),
};
```

Kun ketjussa on viisi I/O- tai parse-vaihetta, toisto tekee funktiosta vaikealukuisen. `?` tiivistää saman logiikan yhdeksi riviksi per vaihe.

## Ratkaisu

**`?`-operaattori** toimii näin `Result`-arvolla:

- **`Ok(v)`** → palauttaa `v` muuttujaan, suoritus jatkuu
- **`Err(e)`** → **palauttaa heti** `Err(e)` (tai muunnetun virheen) koko funktiosta

```rust
fn read_and_parse(path: &str) -> Result<Config, MyError> {
    let text = std::fs::read_to_string(path)?;
    let cfg = toml::from_str(&text)?;
    Ok(cfg)
}
```

Sama ilman `?` (huomaa **`return`** ja mahdollinen **`.into()`**):

```rust
let text = match std::fs::read_to_string(path) {
    Ok(t) => t,
    Err(e) => return Err(e.into()),
};
```

`?` toimii myös **`Option`**:lla: `None` palauttaa `None` funktiosta heti. **`Result`-funktiossa** `Option`-kysymysmerkki muuntaa `None` → `None` vastaavaan `Result`-muotoon automaattisesti tietyin ehdoin.

Virhetyypin on oltava muunnettavissa funktion **`E`**:ksi — esimerkiksi **`impl From<io::Error> for MyError`**.

## Käytännössä

**`main`-funktiossa** voit käyttää:

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cfg = read_and_parse("app.toml")?;
    run(cfg)?;
    Ok(())
}
```

Älä sekoita **`?`** ja **`.unwrap()`** — `unwrap` panikoi virheessä, `?` propagoi virheen hallitusti kutsujalle. Tuotantokoodissa `?` on oletus; `unwrap` vain prototyypeissä tai testeissä.

Async-funktioissa `?` toimii samoin, kun paluutyyppi on esim. **`Result<T, E>`** futuren sisällä. Virhe propagoidaan samalla periaatteella kuin synkronisessa koodissa.

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

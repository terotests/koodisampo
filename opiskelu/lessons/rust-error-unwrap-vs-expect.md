# Prototype-koodissa kutsut `.unwrap()` Resultille. Code review mitä suosittelee tuotantoon?

## Taustaa

**`Result<T, E>`** pakottaa käsittelemään virheet ennen arvon käyttöä. Kun haluat nopeasti prototypoida, **`.unwrap()`** ja **`.expect("viesti")`** purkavat `Ok`-arvon ja **panikoivat** `Err`-haarassa — prosessi kaatuu virheviestillä.

Tämä on ok **kehityksessä ja testeissä**, jossa haluat kaatua heti bugiin. Tuotannossa asiakkaan virheellinen syöte, puuttuva tiedosto tai verkko-ongelma ei saa kaataa koko palvelua — virhe pitää käsitellä, logittaa ja raportoida hallitusti.

Code review -kulttuurissa Rust-yhteisö suosittelee: **`?` tuotantopolussa**, **`unwrap` vain kun panic on tarkoituksellinen** ja perusteltu (esim. testidata, invariantti, jota ei voi rikkoa).

## Tilanne

Palvelu lukee konfiguraation käynnistyksessä prototyypin tapaan:

```rust
fn main() {
    let config: Config = load_config("app.toml").unwrap();
    run_server(config);
}
```

Kehityskoneella `app.toml` on aina olemassa — kaikki toimii. Tuotannossa polku on väärä, tiedosto puuttuu tai JSON on rikki. **`.unwrap()`** kaataa koko prosessin ilman selkeää virheilmoitusta käyttäjälle tai valvontajärjestelmälle.

Sama ongelma toistuu **`Option::unwrap()`**:ssa — `None` kaataa ohjelman yhtä nopeasti kuin `Err`.

## Ratkaisu

Korvaa **`unwrap()`** virheen propagoimisella **`?`**:llä tai eksplisiittisellä **`match`**:llä:

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = load_config("app.toml")?;
    run_server(config)?;
    Ok(())
}
```

**`expect("viesti")`** on `unwrap` + dokumentoitu viesti — sopii kun olet varma, ettei virhe voi tapahtua tuotantopolussa, ja haluat selkeän viestin jos invariantti silti rikkoutuu:

```rust
let static_data = include_str!("embedded.toml");
let cfg: Config = toml::from_str(static_data)
    .expect("embedded config must be valid at compile time");
```

Ero **`unwrap()`** vs **`expect()`**: molemmat panikoivat virheessä, mutta `expect` kertoo *miksi* panic oli ok — helpottaa debuggausta tuotantologeissa.

## Käytännössä

**Prototyypissä** `unwrap` nopeuttaa iterointia — korvaa ne ennen mergeä tuotantokoodiin. **`clippy`**-lint **`unwrap_used`** voi varoittaa tuotantopolun unwrap-kutsuista CI:ssä.

**Kirjasto-API:** älä koskaan `unwrap` asiakkaan dataa — palauta **`Result`**. **Sovelluskerros** (`main`, HTTP-handler) päättää: logita, näytä virhe, yritä uudelleen.

Kun tarvitset oletusarvon virheen sijaan, käytä **`.unwrap_or()`**, **`.unwrap_or_else()`** tai **`match`** — ne eivät panikoi. Valitse tarkoituksellisesti: hallittu virhe (`?`) vs. hallittu oletus vs. tarkoituksellinen panic (`expect`).

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

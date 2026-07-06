# Milloin `panic!` on perusteltu recoverable-virheen sijaan?

## Taustaa

Rust erottaa kaksi virheluokkaa. **Recoverable-virheet** mallinnetaan **`Result<T, E>`**-tyypillä: ohjelma voi yrittää uudelleen, näyttää viestin tai palauttaa virheen kutsujalle. **Unrecoverable-virheet** johtavat **`panic!`**:iin — suoritus pysähtyy ja prosessi kaatuu (tai thread abortoituu).

Panic ei ole "poikkeus, jota voi aina napata" kuten Javassa. Tuotantopalvelussa paniikki yhdessä threadissa voi kaataa koko prosessin, ellei käytä erillistä panic-käsittelyä. Siksi panic on varattu tilanteisiin, joissa jatkaminen olisi **logiikka- tai turvallisuusvirhe** — ei tavalliseen "tiedosto puuttui" -tilanteeseen.

Hyvä nyrkkisääntö: **I/O, verkko ja käyttäjän syöte → `Result`**. **Ohjelmoijan virhe tai mahdoton tila → `panic!` tai `unreachable!()`**.

## Tilanne

Sinulla on tilakone, jossa tietyt siirtymät ovat aina validoitu ennen `match`-lauseketta. Jos jokin variantti tulee silti vastaan, se tarkoittaa sisäistä bugia — ei käyttäjän virhettä:

```rust
enum State {
    Valid(Data),
    Pending,
}

fn process(state: State) -> Output {
    match state {
        State::Valid(data) => transform(data),
        State::Pending => {
            // Tänne ei pitäisi koskaan päätyä process()-kutsussa
            ???
        }
    }
}
```

Tässä **`Result`** olisi harhaanjohtava: kutsuja ei voi "korjata" tilaa — ongelma on koodissa. Palauttaa virhe käyttäjälle antaisi väärän kuvan tilanteesta. Parempi on kaataa nopeasti kehitysvaiheessa ja logittaa tuotannossa.

## Ratkaisu

Käytä **`panic!`** kun invariantti on rikki:

```rust
fn process(state: State) -> Output {
    match state {
        State::Valid(data) => transform(data),
        State::Pending => panic!("process called in Pending state — logic bug"),
    }
}
```

**`unreachable!()`** on panic-makro tilanteisiin, joita kääntäjä pitää mahdottomina mutta ei voi todistaa:

```rust
match opt {
    Some(v) => v,
    None => unreachable!("opt was checked above"),
}
```

**`expect("viesti")`** on `Option`/`Result`-purku, joka panikoi virheviestillä — sopii testeihin ja "tämä ei voi epäonnistua" -kohtiin, joissa viesti dokumentoi oletuksen.

## Käytännössä

**Rajoita panic rajapintaan:** CLI-ohjelman `main` voi panikoida konfiguraatiovirheestä, jos ilman konfiguraatiota ei voi jatkaa. **Kirjasto** ei saa panikoida asiakkaan syötteestä — se palauttaa **`Result`**.

Testeissä **`#[should_panic]`** varmistaa, että bugit paljastuvat. Tuotannossa harkitse **`catch_unwind`** vain rajatusti — se ei korvaa oikeaa virheenkäsittelyä.

Ero **`Result`-virheeseen**: jos tilanne voi johtua ulkoisesta syystä (verkko, levyn täyttyminen, väärä käyttäjäsyöte), palauta **`Err`**. Jos tilanne tarkoittaa "koodimme on rikki", **`panic!`** on rehellisempi.

[Lue lisää](https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html)

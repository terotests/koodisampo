# Funktio palauttaa `Result<T, MyError>` ja kutsuu std-io funktiota. Miten yhdistät virhetyypit siististi?

## Taustaa

Rustin **`?`-operaattori** propagoi virheen automaattisesti, mutta vain jos virhetyypit ovat yhteensopivia. Kun funktiosi palauttaa **`Result<T, MyError>`** ja kutsut standardikirjaston funktiota, joka palauttaa **`Result<_, io::Error>`**, kääntäjä ei tiedä, miten muuntaa `io::Error` → `MyError` ilman apua.

Tähän Rust tarjoaa **`From`**-traitin: jos `MyError` osaa luoda itsensä `io::Error`:stä, **`?`** tekee muunnoksen automaattisesti. **`Into`** on käänteinen suunta — se seuraa `From`-toteutuksesta. Yksi `MyError`-enum kokoaa virhelähteet yhteen, eikä jokainen funktio tarvitse omaa `.map_err()`-ketjua.

## Tilanne

Rakennat funktiota, joka lukee tiedoston ja palauttaa oman virhetyyppisi:

```rust
#[derive(Debug)]
enum MyError {
    Io(std::io::Error),
    Parse(String),
}

fn load(path: &str) -> Result<String, MyError> {
    let text = std::fs::read_to_string(path)?;  // VIRHE ilman From-implia
    Ok(text)
}
```

Ilman **`From<std::io::Error>`** -toteutusta kääntäjä valittaa: `?` ei voi muuntaa `io::Error` → `MyError`. Vaihtoehto on toistaa `.map_err(MyError::Io)` jokaisessa I/O-kutsussa — toimii, mutta on työlästä ja helppo unohtaa.

## Ratkaisu

Toteuta **`From`**-trait virhelähteelle:

```rust
use std::io;

#[derive(Debug)]
enum MyError {
    Io(io::Error),
    Parse(String),
}

impl From<io::Error> for MyError {
    fn from(e: io::Error) -> Self {
        MyError::Io(e)
    }
}

fn load(path: &str) -> Result<String, MyError> {
    let text = std::fs::read_to_string(path)?;  // io::Error → MyError::Io automaattisesti
    Ok(text)
}
```

Nyt **`?`** purkaa `Ok`-arvon jatkoon ja muuntaa `Err(io::Error)` → `Err(MyError::Io(...))` ennen early returnia. Sama toimii ketjussa useille I/O-kutsuille. Lisää tarvittaessa muita **`From`**-toteutuksia (esim. parse-virheille) samalla tavalla.

## Käytännössä

**`thiserror`-crate** lyhentää boilerplatea merkittävästi:

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum MyError {
    #[error("I/O-virhe")]
    Io(#[from] std::io::Error),
}
```

`#[from]` generoi `From`-toteutuksen automaattisesti. **`anyhow`** sopii sovelluskerrokseen, jossa tarvitset joustavaa `Error`-tyyppiä ilman omaa enumia — se on eri työkalu kuin tyypitetty `MyError`, mutta molemmat hyödyntävät `Result` + `?` -mallia.

Kirjasto-API:ssa palauta mieluummin **`Result<T, E>`** kuin panikoi — sovelluskerros päättää, miten virheet näytetään käyttäjälle.

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

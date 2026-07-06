# Miten ajat yksikkötestit Rust-projektissa?

## Taustaa

Rust sisältää testauskehyksen vakiovarustuksena — erillistä testikirjastoa ei tarvita. Testit ovat tavallista Rust-koodia, jota `cargo test` kääntää ja ajaa. Yksikkötestit elävät samassa tiedostossa tai moduulissa kuin testattava koodi, tyypillisesti `#[cfg(test)]`-moduulissa, joka kääntyy vain testauksen yhteydessä.

Testifunktio merkitään `#[test]`-attribuutilla. Epäonnistuminen tapahtuu `assert!`, `assert_eq!` tai `panic!`-kutsulla. Cargo ajaa kaikki testit rinnakkain oletuksena ja raportoi tulokset.

## Tilanne

CI-pipeline tarvitsee luotettavan testikomennon Rust-kirjastolle. Kehittäjä on kirjoittanut apufunktion `parse_config` ja haluaa varmistaa, että se palauttaa oikean arvon validilla syötteellä. Testit pitää ajaa yhdellä komennolla ilman erillistä testirunneria.

```rust
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
// Missä ja miten testataan?
```

## Ratkaisu

Lisää testimoduuli samaan tiedostoon:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_adds_numbers() {
        assert_eq!(add(2, 2), 4);
    }

    #[test]
    fn handles_zero() {
        assert_eq!(add(0, 0), 0);
    }
}
```

Aja testit:

```bash
cargo test                        # kaikki testit
cargo test it_adds                # suodatin nimellä
cargo test -- --nocapture         # näyttää println!-tulosteen
cargo test -- --test-threads=1    # sarjallinen ajo (debug)
```

`#[cfg(test)]` varmistaa, että testikoodi ei päädy tuotantobinaryyn.

## Käytännössä

**Integraatiotestit** sijoitetaan `tests/`-hakemistoon projektin juureen — ne näkevät vain julkisen API:n. `cargo test` ajaa sekä yksikkö- että integraatiotestit.

Doc-testit (`///`-kommenttien koodiblokit) ajetaan samalla komennolla. CI:ssä: `cargo test --locked`. Rinnakkaisten testien jaettu tila vaatii huolellisuutta — käytä temp-hakemistoja tai mutexia, jos testit kirjoittavat samaan resurssiin.

[Lue lisää](https://doc.rust-lang.org/book/ch11-01-writing-tests.html)

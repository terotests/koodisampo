# Haluat generoida satoja satunnaisia syötteitä parserille. Mikä crate sopii property-based -testaukseen?

## Taustaa

Perinteiset **example-based** -testit antavat tiettyjä syötteitä ja tarkistavat odotetun tuloksen. Ne löytävät vain bugit, joita kehittäjä osaa kuvitella — reunatapaukset jäävät helposti testaamatta. **Property-based testing** (ominaisuuspohjainen testaus) generoi satoja tai tuhansia satunnaisia syötteitä ja tarkistaa, että **invariantti** pätee kaikille: esim. "parse ja serialize roundtrip palauttaa alkuperäisen arvon".

Rustissa **proptest** on suosituin property-based -kirjasto. Se generoi syötteitä, kutistaa epäonnistuneen tapauksen minimiin (shrinking) ja raportoi pienimmän toistettavan counterexamplein — debuggaus on helpompaa kuin satunnainen 200-sivuinen merkkijono.

## Tilanne

Kirjoitat `parse_int`-funktion, joka parsii merkkijonon kokonaisluvuksi. Manuaaliset testit kattavat `"0"`, `"42"`, `"-1"` — mutta unohdat `"012"`, tyhjän merkkijonon tai Unicode-numeroita. Parserissa voi olla bugeja, joita et osaa ennakoida. Tarvitset systemaattisemman tavan löytää rikkoutuvat syötteet.

```rust
#[test]
fn parse_zero() { assert_eq!(parse_int("0"), Some(0)); }
#[test]
fn parse_forty_two() { assert_eq!(parse_int("42"), Some(42)); }
// riittääkö?
```

## Ratkaisu

Käytä proptestia invariantin testaamiseen:

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn roundtrip_i32(n: i32) {
        let s = n.to_string();
        prop_assert_eq!(parse_int(&s), Some(n));
    }

    #[test]
    fn rejects_garbage(s in "\\PC*") {
        if s.parse::<i32>().is_err() {
            prop_assert!(parse_int(&s).is_none());
        }
    }
}
```

`proptest!`-makro generoi testifunktion, joka ajaa useita satunnaisia syötteitä. Ensimmäinen parametri (`n: i32`) generoidaan automaattisesti. Toisessa testissä `s in "\\PC*"` määrittää strategian (mikä tahansa Unicode-merkkijono).

Lisää proptest dev-dependenciesiin:

```toml
[dev-dependencies]
proptest = "1"
```

## Käytännössä

Proptest sopii serialisointiin, parseriin, matemaattisiin funktioihin ja kaikkeen, jossa on muotoiltava invariantti. **cargo-fuzz** + libFuzzer jatkuvaan fuzzaukseen tuotantokoodissa — proptest on kehittäjän työkalu testeihin.

Shrinking on proptestin vahvuus: epäonnistuessa se yksinkertaistaa syötettä (`"hello123world"` → `"1"`). Rajaa generointia strategioilla (`0..1000i32`, `prop_oneof!`) — liian laaja strategia hidastaa testejä. Aja `PROPTEST_CASES=10000 cargo test` CI:ssä tiukempaan ajoon.

[Lue lisää](https://docs.rs/proptest/latest/proptest/)

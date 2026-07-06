# Testissä haluat varmistaa panicin ilman #[should_panic] — esim. dynaaminen viesti. Mikä std-API?

## Taustaa

Rust-testeissä paniikin testaus tapahtuu usein `#[should_panic]`-attribuutilla — se on yksinkertainen, kun odotat paniikkia tietyllä syötteellä. Joskus tarvitset **hienovaraisempaa** kontrollia: tarkistaa paniikin jälkeen sivuvaikutuksia, käsitellä useita paniikkeja samassa testissä tai varmistaa paniikki ilman koko testin kaatumista.

`std::panic::catch_unwind` sieppaa paniikin ja palauttaa `Result`-tyypin. Testi jatkuu paniikin jälkeen — voit assertoida `is_err()` ja tarkistaa muun tilan. Tämä on std-kirjaston virallinen tapa testata paniikkia ohjelmallisesti.

## Tilanne

Testaat funktiota, joka panikoi virheellisellä syötteellä. Lisäksi haluat varmistaa, että paniikki tapahtuu **ennen** kuin jaettu tila muuttuu — eli rollback toimii. `#[should_panic]` kaataisi koko testin eikä antaisi tarkistaa mitään paniikin jälkeen.

```rust
fn risky_op(input: i32, counter: &mut i32) {
    *counter += 1;
    if input < 0 {
        panic!("negative input");
    }
}
```

## Ratkaisu

Käytä `catch_unwind` closuren ympärillä:

```rust
use std::panic;

#[test]
fn panics_on_negative() {
    let mut counter = 0;

    let result = panic::catch_unwind(|| {
        risky_op(-1, &mut counter);
    });

    assert!(result.is_err(), "expected panic");
    assert_eq!(counter, 1, "counter updated before panic");
}
```

`catch_unwind` palauttaa `Ok(R)` jos closure ei panikoi, tai `Err(Box<dyn Any + Send>)` jos panikoi. Panic-viestin sisältöä voi tarkistaa `Err`-haarassa downcastilla, jos tarpeen.

Jos closure sieppaa ei-unwind-safe arvoja, tarvitaan wrapper:

```rust
use std::panic::{catch_unwind, AssertUnwindSafe};
catch_unwind(AssertUnwindSafe(|| { /* ... */ }));
```

## Käytännössä

`#[should_panic(expected = "viesti")]` riittää yksinkertaisiin tapauksiin — se on luettavampi. `catch_unwind` sopii, kun testissä on useita vaiheita tai sivuvaikutuksia.

Tuotantokoodissa `catch_unwind` on harvinaista — paniikki on virhetila. Testeissä se on hyväksyttävä työkalu. Huom: `catch_unwind` ei sieppaa abort-paniikkia (`panic = "abort"`) — vain unwind-paniikkia.

[Lue lisää](https://doc.rust-lang.org/std/panic/fn.catch_unwind.html)

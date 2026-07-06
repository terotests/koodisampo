# Milloin `panic!` on perusteltu recoverable-virheen sijaan?

## Tilanne

Enum-variantti jota ei pitäisi koskaan tulla — sisäinen logiikkavirhe.

## Ratkaisu

```rust
match state {
    State::Valid(v) => v,
    _ => panic!("invalid state machine"),
}
```
Tai `unreachable!()` kun kääntäjä ei voi todistaa exhaustivenessiä.

## Käytännössä

Rajoita panic rajapintaan. Kirjasto palauttaa Result — sovellus päättää panicista.

[Lue lisää](https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html)

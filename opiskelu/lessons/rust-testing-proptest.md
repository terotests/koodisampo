# Haluat generoida satoja satunnaisia syötteitä parserille. Mikä crate sopii property-based -testaukseen?

## Tilanne

parse_int hyväksyy tietyt merkkijonot — manuaaliset edge caset eivät riitä.

## Ratkaisu

```rust
use proptest::prelude::*;
proptest! {
    #[test]
    fn roundtrip(n: i32) {
        let s = n.to_string();
        prop_assert_eq!(parse_int(&s).unwrap(), n);
    }
}
```

## Käytännössä

proptest + #[cfg(test)]. cargo-fuzz libFuzzer jatkuvaan fuzzaukseen.

[Lue lisää](https://docs.rs/proptest/latest/proptest/)

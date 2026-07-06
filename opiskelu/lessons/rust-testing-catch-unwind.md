# Testissä haluat varmistaa panicin ilman #[should_panic] — esim. dynaaminen viesti. Mikä std-API?

## Tilanne

Testaat että closure panikoi tietyllä inputilla mutta haluat myös tarkistaa sivuvaikutukset.

## Ratkaisu

```rust
let result = std::panic::catch_unwind(|| { risky_op(bad); });
assert!(result.is_err());
```

## Käytännössä

AssertUnwindSafe wrapper tarvitaan jos closure ei ole unwind-safe.

[Lue lisää](https://doc.rust-lang.org/std/panic/fn.catch_unwind.html)

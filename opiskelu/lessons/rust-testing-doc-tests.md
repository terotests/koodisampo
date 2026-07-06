# Esimerkkikoodi ///-doc-kommentissa pitää pysyä oikeana. Miten ajat doc testit?

## Tilanne

API-doc esimerkki käyttää vanhaa funktionimeä — CI doc test failaa.

## Ratkaisu

```rust
/// Lisää luvut:
/// ```
/// assert_eq!(mylib::add(2, 2), 4);
/// ```
pub fn add(a: i32, b: i32) -> i32 { a + b }
```

## Käytännössä

no_run / ignore / should_panic doc-attribuuteissa. cargo test --doc nopeampi doc-only.

[Lue lisää](https://doc.rust-lang.org/rustdoc/write-documentation/documentation-tests.html)

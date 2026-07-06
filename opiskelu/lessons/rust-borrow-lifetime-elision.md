# Funktio palauttaa `&str` kahdesta parametrista. Milloin tarvitset eksplisiittiset lifetime-merkinnät?

## Tilanne

```rust
fn longest(x: &str, y: &str) -> &str { ... }  // virhe ilman lifetimea
```

## Ratkaisu

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```
Lifetime kertoo: palautusviittaus elää yhtä kauan kuin lyhyin input.

## Käytännössä

Struct-kentissä viittaukset vaativat usein `struct Foo<'a> { r: &'a str }`. Elision hoitaa yksinkertaiset getterit.

[Lue lisää](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)

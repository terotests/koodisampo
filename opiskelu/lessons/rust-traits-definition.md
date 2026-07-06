# Mikä Rustin trait vastaa käytännössä Java-interfacen roolia?

## Tilanne

Useat tyypit tarvitsevat `summary()`-metodin — copy-paste impl vs jaettu sopimus.

## Ratkaisu

```rust
trait Summary { fn summarize(&self) -> String; }
impl Summary for Article { ... }
impl Summary for Tweet { ... }
```

## Käytännössä

Trait bounds rajaavat geneerisiä funktioita: `fn notify(item: &impl Summary)`.

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html)

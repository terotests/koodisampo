# Geneerinen funktio `fn largest<T>(list: &[T]) -> T` vaatii vertailun. Miten rajaat T:n?

## Tilanne

Generic utility ei käänny — `T` ei toteuta tarvittavaa traitia.

## Ratkaisu

```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T { ... }
// tai fn largest<T>(list: &[T]) -> &T where T: PartialOrd
```

## Käytännössä

Useat boundit: `T: Display + Clone`. Associated types traitin sisällä.

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html)

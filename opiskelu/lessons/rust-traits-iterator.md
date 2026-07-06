# Mikä trait mahdollistaa `for item in collection` -silmukan?

## Tilanne

Custom collection pitää käydä läpi for-silmukalla.

## Ratkaisu

```rust
impl IntoIterator for MyList { ... }
// tai impl Iterator for MyIter { fn next(&mut self) -> Option<Self::Item> }
```

## Käytännössä

`.iter()` / `.iter_mut()` / `.into_iter()` eri lainaustavoille. Adapterit: map, filter, collect.

[Lue lisää](https://doc.rust-lang.org/book/ch13-02-iterators.html)

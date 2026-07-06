# Milloin `unsafe`-lohko on perusteltu?

## Tilanne

Kutsut C-kirjastoa — raw pointer validiteetti on ohjelmoijan vastuulla.

## Ratkaisu

```rust
unsafe fn dangerous() { /* dereference raw ptr */ }
// unsafe { dangerous(); } — kutsu merkitään
```

## Käytännössä

Abstraktoi unsafe pienen safe API:n taakse. miri/clippy auttavat.

[Lue lisää](https://doc.rust-lang.org/book/ch19-01-unsafe-rust.html)

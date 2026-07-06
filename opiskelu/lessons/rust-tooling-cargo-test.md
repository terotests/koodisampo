# Miten ajat yksikkötestit Rust-projektissa?

## Tilanne

CI-pipeline tarvitsee testikomennon Rust-kirjastolle.

## Ratkaisu

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() { assert_eq!(2+2, 4); }
}
```
`cargo test -- --nocapture` näyttää println!

## Käytännössä

Integration tests: tests/*.rs. cargo test name_filter.

[Lue lisää](https://doc.rust-lang.org/book/ch11-01-writing-tests.html)

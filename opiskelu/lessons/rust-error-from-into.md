# Funktio palauttaa `Result<T, MyError>` ja kutsuu std-io funktiota. Miten yhdistät virhetyypit siististi?

## Tilanne

Jokainen `?` io::Result-kutsussa vaatii manuaalista `.map_err()` ilman From-implia.

## Ratkaisu

```rust
#[derive(Debug)]
enum MyError { Io(std::io::Error) }
impl From<std::io::Error> for MyError {
    fn from(e: std::io::Error) -> Self { MyError::Io(e) }
}
```

## Käytännössä

`thiserror`-crate lyhentää boilerplatea. `anyhow` sovelluskerrokseen.

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

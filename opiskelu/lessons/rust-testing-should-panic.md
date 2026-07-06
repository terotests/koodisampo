# Testaat että funktio panikoi virheellisellä syötteellä. Mikä attribuutti?

## Tilanne

parse_port("99999") pitää panicoida tai assertoida — haluat varmistaa panicin.

## Ratkaisu

```rust
#[test]
#[should_panic(expected = "invalid port")]
fn rejects_bad_port() {
    parse_port("99999");
}
```

## Käytännössä

Result-pohjaisessa API:ssa preferoi assert!(f().is_err()) panicin sijaan.

[Lue lisää](https://doc.rust-lang.org/book/ch11-01-writing-tests.html#checking-for-panics-with-should-panic)

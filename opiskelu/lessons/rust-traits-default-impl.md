# Trait-metodilla on oletustoteutus. Miten tyyppi käyttää sitä ilman omaa impl:ia?

## Tilanne

Trait tarjoaa `fn hello() { println!("default"); }` — useimmat tyypit tyytyvät siihen.

## Ratkaisu

```rust
trait Greeter { fn hello(&self) { println!("hi"); } }
struct User;
impl Greeter for User {}
```

## Käytännössä

Ero Default-traitiin (Default::default()). Trait default ≠ #[derive(Default)].

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html#default-implementations)

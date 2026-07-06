# Metodi muokkaa structia. Mikä receiver on oikea: `self`, `&self` vai `&mut self`?

## Tilanne

Impl-metodi kasvattaa sisäistä laskuria — valitse receiver.

## Ratkaisu

```rust
impl Counter {
    fn inc(&mut self) { self.n += 1; }
    fn read(&self) -> u32 { self.n }
}
```

## Käytännössä

Consuming metodit (self) harvoin — esim. `fn into_inner(self) -> T`.

[Lue lisää](https://doc.rust-lang.org/book/ch05-03-method-syntax.html)

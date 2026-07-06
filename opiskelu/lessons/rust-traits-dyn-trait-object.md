# Tarvitset heterogeenisen vektorin eri tyypeistä samalla traitilla. Mikä tyyppi?

## Tilanne

UI piirtää listan `Drawable`-objekteja — Circle, Rect eri tyyppejä.

## Ratkaisu

```rust
let shapes: Vec<Box<dyn Drawable>> = vec![
    Box::new(Circle { r: 1.0 }),
    Box::new(Rect { w: 2, h: 3 }),
];
```

## Käytännössä

dyn Trait vaatii object safety. impl Trait staattiseen polymorfiaan — no heap, inlinattavissa.

[Lue lisää](https://doc.rust-lang.org/book/ch17-02-trait-objects.html)

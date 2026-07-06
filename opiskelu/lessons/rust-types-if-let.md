# Haluat käsitellä vain `Option`:n `Some`-haaran. Mikä syntaksi on siistein?

## Tilanne

Option-ketju yhdessä kohdassa — täysi match tuntuu verbosilta.

## Ratkaisu

```rust
if let Some(user) = find_user(id) {
    send_email(&user);
}
// while let Some(line) = lines.next() { ... }
```

## Käytännössä

while let sopii iteratorin kulutukseen. if let + else Some/None molemmille.

[Lue lisää](https://doc.rust-lang.org/book/ch18-01-all-the-places-for-patterns.html)

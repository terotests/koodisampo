# Luot uuden struct-instanssin kopioimalla vanhan mutta vaihdat yhden kentän. Mikä syntaksi?

## Tilanne

Päivität yhden kentän User-structissa API-kutsun jälkeen.

## Ratkaisu

```rust
let updated = User {
    email: "new@example.com".into(),
    ..user
};
```
Huom: `..user` **move**aa käyttämättömät kentät jos ne eivät ole Copy.

## Käytännössä

Jos vanha instanssi tarvitaan vielä, kloonaa ensin tai päivitä kentät erikseen.

[Lue lisää](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#creating-instances-from-other-instances-with-struct-update-syntax)

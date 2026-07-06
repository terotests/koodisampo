# Funktio ottaa merkkijonon parametriksi mutta ei tarvitse omistaa sitä. Mikä tyyppi on idiomaattisin?

## Tilanne

API ottaa `String`-parametrin, vaikka vain lukee tekstiä — turhia allokaatioita ja `.to_string()`-kutsuja kutsukohdissa.

## Ratkaisu

```rust
fn greet(name: &str) { println!("Hei, {}", name); }

greet("Maija");           // string literal → &str
greet(&owned_string);     // &String → &str (Deref)
```

## Käytännössä

Funktion palauttaessa tekstiä tarvitaan usein `String`. Parametreissa suosi `&str` — joustavin rajapinta.

[Lue lisää](https://doc.rust-lang.org/book/ch04-03-slices.html)

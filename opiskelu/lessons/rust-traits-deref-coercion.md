# Funktio odottaa `&str` mutta saat `&String`. Miksi koodi kääntyy?

## Taustaa

Rustissa funktioparametri on usein viite kapeampaan tyyppiin (`&str`), vaikka käytössä on laajempi tyyppi (`String`). **Deref coercion** on kääntäjän automaattinen muunnos: se kutsuu tyyppisi `Deref`-traitin ja "löytää" sopivan viitteen ilman, että sinun tarvitsee kirjoittaa `.as_str()` joka kutsussa.

Coercion toimii vain viitteiden välillä ja vain tiettyjen sääntöjen mukaisesti. Se tekee API:sta miellyttävämmän — kirjastot voivat hyväksyä `&str`-parametreja, ja `String`-, `&String`- sekä string-slicet toimivat samassa paikassa.

## Tilanne

Funktio ottaa merkkijonoviitteen:

```rust
fn greet(name: &str) {
    println!("Hei, {}!", name);
}

fn main() {
    let username = String::from("Matti");
    greet(&username);  // &String, ei &str — silti OK
}
```

Aloittelija odottaa virhettä tai pakollista `greet(username.as_str())`. Koodi kääntyy, koska `String` toteuttaa `Deref<Target = str>`: viite `&String` pakotetaan automaattisesti muotoon `&str`.

## Ratkaisu

`Deref`-trait määrittää, mihin sisäiseen tyyppiin smart pointer (tai `String`) viittaa:

```rust
use std::ops::Deref;

impl Deref for String {
    type Target = str;
    fn deref(&self) -> &str { /* ... */ }
}
```

Kääntäjä soveltaa ketjua: `&String` → `&str` kun funktio odottaa jälkimmäistä. Sama pätee moniin muihin: `&Vec<T>` → `&[T]`, `&Box<T>` → `&T`, `&Cow<str>` → `&str`.

```rust
fn sum(nums: &[i32]) -> i32 { nums.iter().sum() }

let v = vec![1, 2, 3];
sum(&v);  // &Vec<i32> → &[i32]
```

## Käytännössä

Hyödynnä coercionia API-suunnittelussa: parametri `&str` hyväksyy sekä literaalit että `String`-arvot. Älä tee omista tyypeistä "läpinäkyviä" smart pointereja turhaan — `Deref`-coercion on tarkoitettu transparenssille (kuten `String` → `str`), ei piilotetulle logiikalle.

Liian aggressiivinen `Deref`-impl voi hämmentää lukijaa ja piilottaa kalliita operaatioita. Pidä `Deref` yksinkertaisena viittauksen avauksena; erilliset metodit (`as_str()`, `as_slice()`) ovat selkeämpiä, kun muunnos ei ole triviaali.

[Lue lisää](https://doc.rust-lang.org/book/ch15-02-deref.html)

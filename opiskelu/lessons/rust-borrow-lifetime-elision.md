# Funktio palauttaa `&str` kahdesta parametrista. Milloin tarvitset eksplisiittiset lifetime-merkinnät?

## Taustaa

Lainaus (`&T`) viittaa johonkin **omistettuun** dataan — merkkijonoon, vektoriin, structiin. Kääntäjän täytyy varmistaa, ettei viittaus elä pidempään kuin data, johon se osoittaa. **Lifetime**-merkinnät (`'a`) kuvaavat tätä suhdetta tyypeissä; ne eivät muuta ajonaikaista käytöstä, vaan auttavat kääntäjää.

Java- ja Python-maailmassa GC pitää objektit elossa niin kauan kuin viittauksia on. Rustissa omistaja määrittää elinkaaren — lifetime on tapa sanoa kääntäjälle: "tämä palautettu viittaus elää yhtä kauan kuin nämä parametrit (tai lyhyempään niistä)".

## Tilanne

Kirjoitat funktion, joka palauttaa pidemmän kahdesta merkkijonosta:

```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}
// KÄÄNTÄJÄVIRHE: missing lifetime specifier
```

Miksi virhe? Kääntäjä ei tiedä, liittyykö palautettu `&str` parametriin `x`, parametriin `y`, vai johonkin kolmanteen. Ilman tietoa se ei voi varmistaa turvallisuutta. Tämä ei ole runtime-ongelma — se on käännösaikainen tyyppiongelma.

## Ratkaisu

Eksplisiittinen lifetime sanoo: palautusviittaus elää yhtä kauan kuin **molemmat** parametrit (tässä tapauksessa lyhyin niistä riittää):

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

let s1 = String::from("pitkä teksti");
let s2 = String::from("lyhyt");
let result = longest(s1.as_str(), s2.as_str());
// result kelpaa niin kauan kuin s1 ja s2 ovat voimassa
```

`'a` on **elinaika-parametri** — sama ajatus kuin geneerinen tyyppiparametri `T`, mutta viittauksille. Funktio lupaa: en palauta viittausta, joka elää pidempään kuin kumpikaan syöte.

Structeissa viittauskentät tarvitsevat lifetimen:

```rust
struct Excerpt<'a> {
    text: &'a str,
}
// Excerpt ei voi elää pidempään kuin text, johon se viittaa
```

## Käytännössä

**Lifetime elision** (elision rules) täyttää lifetimet automaattisesti monissa yksinkertaisissa tapauksissa:

- Jokaisella parametri, jolla on lainaus, saa oman lifetime-parametrinsa
- Jos on yksi syötelainaus, se annetaan paluuarvolle
- Jos on `&mut self`, sen lifetime menee paluuarvolle

Siksi `fn first_word(s: &str) -> &str` kääntyy ilman `'a`-kirjoittamista — elision tekee saman. `longest`-tyyppinen funktio (kaksi lainausta, yksi paluu) tarvitsee eksplisiittisen `'a`:n.

Älä over-engineeraa lifetimella: aloita ilman `'a`:ta; lisää vain kun kääntäjä pyytää. `'static` on erikoistapaus (erillinen oppitunti) — se tarkoittaa "elää koko ohjelman ajan", ei "ikuisesti kaikille tyypeille".

Virhe "returned reference does not live long enough" tarkoittaa usein: yrität palauttaa viittauksen paikalliseen muuttujaan (`&local`) — sitä elision ei voi korjata.

[Lue lisää](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)

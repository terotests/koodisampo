# Trait-metodilla on oletustoteutus. Miten tyyppi käyttää sitä ilman omaa impl:ia?

## Taustaa

Trait määrittää käyttäytymisen, jota useat tyypit voivat jakaa. Metodilla voi olla **oletustoteutus** traitin `impl`-lohkossa — sama idea kuin interface-metodilla oletuslogiikka muissa kielissä, mutta Rustissa se on eksplisiittistä.

Oletustoteutus vähentää toistoa: yhteinen logiikka kirjoitetaan kerran traitiin, ja tyypit, jotka hyväksyvät sen, eivät tarvitse omaa koodia. Jos tyyppi tarvitsee eri käyttäytymisen, se **ylikirjoittaa** metodin omassa `impl`-lohkossaan.

## Tilanne

Määrittelet traitin, jossa `hello` tulostaa tervehdyksen. Useimmat tyypit tyytyvät oletukseen — esimerkiksi `User`-struct ei tarvitse erityistä logiikkaa:

```rust
trait Greeter {
    fn hello(&self) {
        println!("Hei, olet tervetullut!");
    }
}
```

Haluat, että `User` toteuttaa traitin ilman metodin uudelleenkirjoitusta. Kysymys on: riittääkö tyhjä `impl`, vai pitääkö metodi määritellä uudelleen?

## Ratkaisu

Tyhjä `impl Trait for Type` riittää — tyyppi perii traitin oletustoteutuksen automaattisesti:

```rust
struct User {
    name: String,
}

impl Greeter for User {}
// User::hello() kutsuu traitin oletusmetodia

fn main() {
    let u = User { name: "Ada".into() };
    u.hello();  // tulostaa: Hei, olet tervetullut!
}
```

Jos yksi tyyppi tarvitsee oman version, ylikirjoitat vain sen metodin:

```rust
struct Admin;

impl Greeter for Admin {
    fn hello(&self) {
        println!("Admin-konsoli avattu.");
    }
}
```

## Käytännössä

Traitin oletustoteutus **ei** ole sama asia kuin `Default`-trait tai `#[derive(Default)]`. `Default::default()` luo tyypin oletusarvon; trait-metodin oletus on valmis funktio, jota voit kutsua suoraan.

Oletustoteutuksia käytetään yleisesti apumetodeissa ja "template method" -kuvioissa: trait tarjoaa rungon, alityypit täyttävät vain poikkeukset. Tarkista aina, että oletuslogiikka sopii kaikille `impl`-tyypeille — muuten ylikirjoitus on pakko.

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html#default-implementations)

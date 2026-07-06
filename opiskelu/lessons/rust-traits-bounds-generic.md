# Geneerinen funktio `fn largest<T>(list: &[T]) -> T` vaatii vertailun. Miten rajaat T:n?

## Taustaa

Geneerinen funktio kirjoitetaan kerran, mutta sen täytyy silti tietää, mitä operaatioita tyypillä `T` saa tehdä. Rust ei arvaa vertailua tai tulostusta — kääntäjä vaatii **trait boundin**, joka kertoo: "tämä `T` osaa ainakin nämä asiat".

Trait bound on sopimus tyypin ja funktion välillä. Ilman sitä koodi kuten `if a > b` ei käänny, koska kääntäjä ei tiedä, onko `T`:llä järjestysrelaatiota. Boundit tekevät geneerisestä koodista sekä uudelleenkäytettävää että turvallista.

## Tilanne

Kirjoitat apufunktion, joka etsii vektorin suurimman alkion:

```rust
fn largest<T>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {  // VIRHE: binary operation `>` cannot be applied to type `T`
            largest = item;
        }
    }
    largest
}
```

Kääntäjä valittaa, että `T` ei toteuta vertailua. Sama ongelma ilmenee, kun haluat tulostaa arvon (`Display`) tai kopioida sen (`Clone`). Generic utility ei käänny ilman rajauksia.

## Ratkaisu

Rajaat `T`:n traitilla, joka tarjoaa tarvittavan metodin. Vertailuun riittää `PartialOrd`; palautat usein viitteen, ettei tarvitse `Copy`-rajausta:

```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

Useampi vaatimus yhdistetään `+`-merkillä. Pitkissä signatuureissa `where`-lohko on luettavampi:

```rust
fn debug_and_clone<T>(x: T) -> T
where
    T: std::fmt::Display + Clone,
{
    println!("{}", x);
    x.clone()
}
```

## Käytännössä

Valitse kapein bound, joka riittää tehtävään — `PartialOrd` riittää maksimille, `Ord` vain jos tarvitset kokonaista järjestystä. Useat boundit (`Display + Clone`) kertovat heti, mitä funktio odottaa tyypiltä.

Traitin **associated type** (esim. `Iterator::Item`) määrittää geneerisen palautteen traitin sisällä. Kun funktio palauttaa `impl Iterator`, kääntäjä hoitaa tyypin; kun tarvitset eksplisiittisen parametrin, bound kirjoitetaan `T: Iterator<Item = u32>` -muodossa.

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html)

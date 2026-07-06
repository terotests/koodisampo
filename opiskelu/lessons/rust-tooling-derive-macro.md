# Mitä `#[derive(Clone, PartialEq)]` tekee käännöksen aikana?

## Taustaa

Monet Rust-traitit voidaan **toteuttaa automaattisesti** kääntäjän avulla — niitä kutsutaan **derivable** (johdettavissa) trait:eiksi. `#[derive(...)]`-attribuutti käskee kääntäjää generoimaan trait-toteutuksen structille tai enumille kenttien perusteella. Tämä säästää kymmeniä rivejä toistuvaa boilerplate-koodia.

Derive on **proc-macro**-prosessi käännösaikana: kääntäjä näkee struct-määrittelyn ja lisää impl-lohkon automaattisesti. Toteutus noudattaa kenttien rakennetta — esimerkiksi `Clone` kloonaa jokaisen kentän, `PartialEq` vertaa kentät parittain.

## Tilanne

Määrittelet tapahtumastructin, jossa on 20 kenttää — id, aikaleima, payload, metadata. Tarvitset `Clone`-toteutuksen testeissä ja `PartialEq`-vertailun assert_eq!:ssä. Manuaalinen impl olisi pitkä, virhealtis ja päivitettävä joka kenttämuutoksella.

```rust
struct Event {
    id: u64,
    name: String,
    timestamp: u64,
    // ... 17 muuta kenttää
}
// impl Clone { ... } — kymmeniä rivejä
```

## Ratkaisu

Lisää derive-attribuutti struct-määrittelyn yläpuolelle:

```rust
#[derive(Clone, PartialEq, Eq, Debug, Hash)]
struct Event {
    id: u64,
    name: String,
    timestamp: u64,
}

#[test]
fn events_equal() {
    let a = Event { id: 1, name: "click".into(), timestamp: 100 };
    let b = a.clone();
    assert_eq!(a, b);
}
```

Kääntäjä generoi automaattisesti:

- `Clone`: kloonaa `id`, `name` (String.clone()), `timestamp`
- `PartialEq` / `Eq`: vertaa kentät `==`-operaattorilla
- `Debug`: `println!("{:?}", event)` -tulostus
- `Hash`: hash-funktio `HashMap`-avaimiksi

## Käytännössä

Yleisimmät derivet: `Debug`, `Clone`, `Copy` (pienet Copy-tyypit), `PartialEq`, `Eq`, `Hash`, `Default`, `Ord`. **Serde** (`#[derive(Serialize, Deserialize)]`) vaatii erillisen `serde`-craten — ei std-derive.

Custom derive omalla proc-macro-cratella (`#[derive(MyTrait)]`) on edistynyt aihe. Derive toimii vain, jos kaikki kentät tukevat kyseistä traitia — esim. `Copy` vaatii Copy-kentät. Enum-derive generoi match-logiikan varianttien mukaan.

[Lue lisää](https://doc.rust-lang.org/book/appendix-03-derivable-traits.html)

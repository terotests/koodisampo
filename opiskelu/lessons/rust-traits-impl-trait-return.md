# Funktio palauttaa aina saman konkreettisen tyypin, mutta haluat piilottaa sen kutsujalta ja luvata vain traitin. Mikä paluutyyppi?

## Taustaa

Funktion paluutyyppi on usein tarkka struct (`NewsArticle`), mutta joskus haluat palauttaa "jotain, joka toteuttaa traitin" ilman, että kutsuja tietää tarkkaa tyyppiä. **`impl Trait` paluupaikassa** on Rustin tapa ilmaista staattinen polymorfia: kääntäjä tietää tarkan tyypin, mutta API piilottaa sen.

Tämä eroaa `Box<dyn Trait>` -tyypistä: `impl Trait` ei käytä trait object -allokaatiota eikä vtable-kutsuja. Se sopii, kun funktio palauttaa aina **yhden ja saman konkreettisen tyypin**. Jos sama funktio palauttaisi eri haaroissa eri tyyppejä, `impl Trait` ei käy — silloin tarvitaan `Box<dyn Trait>` tai enum.

## Tilanne

Kirjaston funktio luo uutisartikkelin, joka toteuttaa `Summary`-traitin. Et halua sitoa API:a `NewsArticle`-tyyppiin, koska sisäinen toteutus voi myöhemmin vaihtua:

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct NewsArticle { headline: String }

// Paluutyyppi? Kutsujan pitäisi nähdä vain, että arvo toteuttaa Summaryn
fn make_content() -> ??? {
    NewsArticle { headline: "Uutinen".into() }
}
```

Konkreettinen tyyppi on aina sama, mutta sen nimi ei kuulu julkiseen API:in. Kutsujalle riittää lupaus traitista.

## Ratkaisu

Käytä `impl Summary` paluutyyppinä, kun palautat **yhden** konkreettisen tyypin per funktio:

```rust
fn returns_article() -> impl Summary {
    NewsArticle { headline: "Rust 2024".into() }
}

fn returns_tweet() -> impl Summary {
    Tweet { author: "Ferris".into(), content: "Crab time".into() }
}
```

Jos **sama funktio** palauttaa eri tyyppejä eri haaroissa (esim. artikkelin tai twiitin), `impl Summary` ei käänny — tarvitset `enum`-kääreen tai `Box<dyn Summary>`:

```rust
enum Content {
    Article(NewsArticle),
    Tweet(Tweet),
}
```

## Käytännössä

`async fn` palauttaa käytännössä `impl Future` — sama periaate piilottaa monimutkaisen tyyppipuun. `impl Trait` paluupaikassa on yleinen kirjasto-API:ssa, kun haluat joustavuuden ilman dynaamista allokaatiota.

Muista: `impl Trait` palautus on staattinen — kääntöaikainen tyyppi on kiinteä per funktio. Dynaamiseen valintaan ajonaikaisesti käytä trait objecteja tai enumia, jossa jokainen variantti toteuttaa traitin.

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html)

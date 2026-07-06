# Funktio palauttaa eri konkreettisia tyyppejä samasta traitista. Mikä paluutyyppi piilottaa konkreettisen tyypin?

## Taustaa

Funktion paluutyyppi on usein tarkka struct (`NewsArticle`), mutta joskus haluat palauttaa "jotain, joka toteuttaa traitin" ilman, että kutsuja tietää tarkkaa tyyppiä. **`impl Trait` paluupaikassa** on Rustin tapa ilmaista staattinen polymorfia: kääntäjä tietää tarkan tyypin, mutta API piilottaa sen.

Tämä eroaa `Box<dyn Trait>` -tyypistä: `impl Trait` ei käytä trait object -allokaatiota eikä vtable-kutsuja. Se sopii, kun funktio palauttaa **yhden konkreettisen tyypin** kerrallaan, vaikka eri kutsuissa tyyppi voisi teoriassa vaihdella eri funktioissa.

## Tilanne

Factory-funktio palauttaa joko uutisartikkelin tai twiitin — molemmat toteuttavat `Summary`-traitin:

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct NewsArticle { headline: String }
struct Tweet { author: String, content: String }

// Palautustyyppi? NewsArticle ja Tweet ovat eri structeja
fn make_content(flag: bool) -> ??? {
    if flag {
        NewsArticle { headline: "Uutinen".into() }
    } else {
        Tweet { author: "Ada".into(), content: "Hei!".into() }
    }
}
```

Sama funktio ei voi palauttaa kahta eri struct-tyyppiä suoraan — Rust vaatii yhden paluutyyppin. Trait auttaa abstraktiotasolla.

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

Jos **sama funktio** palauttaa eri tyyppejä eri haaroissa, tarvitset `enum`-kääreen tai `Box<dyn Summary>`:

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

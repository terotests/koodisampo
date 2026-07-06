# Funktio palauttaa eri konkreettisia tyyppejä samasta traitista. Mikä paluutyyppi piilottaa konkreettisen tyypin?

## Tilanne

Factory palauttaa joko `NewsArticle` tai `Tweet` — molemmat `Summary`.

## Ratkaisu

```rust
fn returns_summarizable() -> impl Summary {
    NewsArticle { ... }
}
```

## Käytännössä

async fn palauttaa impl Future. Useampi tyyppi samasta funktiosta vaatii Box<dyn Trait> tai enum.

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html)

# Testi käyttää oikeaa sleepiä ja kestää 30 sekuntia. Miten nopeutat?

## Taustaa

Async-testit, jotka odottavat oikeaa aikaa (`tokio::time::sleep`, `std::thread::sleep`), hidastavat CI-putkea ja kehittäjän palautetta. Tuotantokoodissa sleep on oikein; testeissä aika pitää **kontrolloida**.

Tokio tarjoaa testiaikaa: `#[tokio::test(start_paused = true)]` + `tokio::time::advance()`.

## Tilanne

Retry-logiikka testataan oikealla viiveellä:

```rust
#[tokio::test]
async fn retries_after_backoff() {
    let service = Service::new();
    service.trigger_retry().await;
    tokio::time::sleep(Duration::from_secs(30)).await;  // CI odottaa 30 s
    assert!(service.ready().await);
}
```

Testi on oikea mutta hidas. Sadat testit × 30 sekuntia tekee CI:stä käyttökelvottoman. Kehittäjät ohittavat testin tai `--ignored` — kattavuus heikkenee.

## Ratkaisu

Käytä Tokion testiaikaa:

```rust
#[tokio::test(start_paused = true)]
async fn retries_after_backoff() {
    let service = Service::new();
    service.trigger_retry().await;

    tokio::time::advance(Duration::from_secs(30)).await;
    assert!(service.ready().await);
}
```

- `start_paused = true` — aika ei kulje oikeasti
- `tokio::time::advance(...)` — siirtää virtuaalikelloa eteenpäin
- älä odota oikeaa aikaa testeissä

Varmista, että tuotantokoodi käyttää `tokio::time::sleep` (ei `std::thread::sleep`), jotta testiaika toimii.

## Käytännössä

Integraatiotestit, jotka tarvitsevat oikean verkon tai tietokannan, erotellaan yksikkötesteistä. Aikaperusteinen logiikka testataan pausetulla kellolla; oikea I/O erillisessä (harvemmassa) integraatiokerroksessa.

Jos käytät `Instant::now()` suoraan, harkitse injektoitavaa kelloa (`Clock`-trait) testattavuuden vuoksi.

[Lue lisää](https://docs.rs/tokio/latest/tokio/attr.test.html)

# async-funktiossa tarvitset viiveen. Miksi `std::thread::sleep` on huono valinta?

## Taustaa

Async-runtime jakaa worker-säieitä rajallisesti — tyypillisesti yhtä säiettä kohti useita tuhansia tehtäviä. Kun tehtävä odottaa, runtime voi ajaa muita tehtäviä samalla säikeellä. **Blokkaava** kutsu pysäyttää koko säieen: mikään muu tehtävä ei etene sen aikana.

`std::thread::sleep` on synkroninen ja blokkaava. Async-kontekstissa se tukkii worker-säieen koko unen ajaksi — sama ongelma kuin synkroninen tiedosto-I/O tai `Mutex::lock()` ilman awaitia. Tokio tarjoaa async-vastineen `tokio::time::sleep`.

## Tilanne

Rakennat retry-logiikkaa HTTP-clientiin: jos pyyntö epäonnistuu, odota 500 ms ennen uutta yritystä. Async-funktiossa `std::thread::sleep(Duration::from_millis(500))` näyttää toimivan, mutta palvelimella, jossa on yksi worker-säie ja sata samanaikaista pyyntöä, yksi sleep jäädyttää kaikki muut odottavat tehtävät.

## Ratkaisu

Käytä `tokio::time::sleep` ja `.await`:

```rust
use tokio::time::{sleep, Duration};

async fn fetch_with_retry() -> Result<Response, Error> {
    for attempt in 0..3 {
        match try_request().await {
            Ok(resp) => return Ok(resp),
            Err(e) if attempt < 2 => {
                sleep(Duration::from_millis(500)).await;
            }
            Err(e) => return Err(e),
        }
    }
    unreachable!()
}
```

`sleep(...).await` rekisteröi ajastimen runtimeen ja **yieldaa** säieen muille tehtäville. Kun aika kuluu, tehtävä herätetään ja jatkuu.

## Käytännössä

Toistuviin ajastuksiin sopii `tokio::time::interval` — se pitää rytmin tasaisena driftistä huolimatta. Yksittäiseen deadlineen: `tokio::time::timeout(duration, future)`.

Exponential backoff retryssä: `sleep(Duration::from_millis(100 * 2u64.pow(attempt))).await`. Testeissä `tokio::time::pause()` ja `advance()` nopeuttavat ajastinpohjaisia testejä ilman oikeaa odotusta.

Yksinkertaiseen "odota ennen seuraavaa yritystä" -logiikkaan `sleep` riittää. Monimutkaisempaan aikataulutukseen (cron-tyylinen ajastus) harkitse erillistä ajastinpalvelua tai `tokio-cron-scheduler`-crateta.

[Lue lisää](https://docs.rs/tokio/latest/tokio/time/fn.sleep.html)

# Taustatehtävä panikoi, mutta kukaan ei huomaa. Mikä meni pieleen?

## Taustaa

`tokio::spawn` palauttaa `JoinHandle<T>`. Jos handle pudotetaan eikä tehtävä itse logita virheitä, **panic** tai käsittelemätön `Result::Err` voi jäädä näkymättömäksi. Fire-and-forget on ok vain, kun epäonnistuminen on hyväksyttävää tai käsitellään spawnin sisällä.

Tämä on yleinen tuotantobugi: palvelu vastaa HTTP-pyyntöön nopeasti, mutta taustatyö epäonnistuu hiljaa.

## Tilanne

Lokituskutsu ajetaan taustalla ilman virheenkäsittelyä:

```rust
async fn handle_request(req: Request) -> Response {
    let entry = build_log_entry(&req);

    tokio::spawn(async move {
        log_to_db(entry).await.unwrap();  // panic tai virhe katoaa
    });

    build_response(req).await
}
```

`log_to_db` epäonnistuu tietokantaongelman vuoksi. `unwrap` panikoi spawnatun tehtävän sisällä. Kukaan ei `await`:aa `JoinHandle`:a — virhe ei propagoidu HTTP-vastaukseen eikä välttämättä näy lokeissa (riippuu runtime-asetuksista).

## Ratkaisu

- `await`:aa `JoinHandle` hallitussa paikassa, kun tulos on tärkeä
- käytä `JoinSet` useille taustatehtäville ja kerää virheet
- logita virhe spawnatun tehtävän sisällä (`if let Err(e) = ...`)
- graceful shutdownissa odota tärkeät tehtävät loppuun

```rust
let handle = tokio::spawn(async move {
    log_to_db(entry).await
});

// Jos tulos on kriittinen:
if let Err(e) = handle.await? {
    tracing::error!("background log failed: {e}");
}
```

HTTP-handlerissa usein riittää logitus spawnin sisällä — mutta se pitää tehdä tietoisesti, ei `unwrap`:lla.

## Käytännössä

`JoinError` tarkoittaa, että tehtävä panikoi tai peruutettiin (`abort`). Erottele odotettu virhe (`Result` tehtävän sisällä) ja odottamaton panic (`JoinError`).

Tuotannossa seuraa taustatehtävien määrää ja epäonnistumisia. Graceful shutdown: kerää aktiiviset `JoinHandle`:t ja odota niiden valmistumista ennen prosessin sulkemista.

[Lue lisää](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html)

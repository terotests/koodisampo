# async fn:ssä haluat ajaa toisen async-tehtävän taustalla saman runtime:n alla. Mikä tokio-API?

## Taustaa

Async-funktio suoritetaan yhdessä tehtävässä (task) runtime-ajurin alla. Jos haluat tehdä työtä **rinnakkain** saman runtime:n sisällä — ilman erillistä säiettä — käynnistät uuden tehtävän `tokio::spawn`-kutsulla. Spawnattu tehtävä ajetaan taustalla samalla worker-säiepoolilla.

Spawn eroaa tavallisesta async-kutsusta: se ei odota valmistumista. Palauttaa `JoinHandle`, jolla voit myöhemmin `.await`-ata tuloksen tai jättää tehtävän "fire-and-forget" -tilaan. Spawnattu closure täytyy olla `Send + 'static`.

## Tilanne

HTTP-palvelu vastaa pyyntöön heti, mutta haluaa kirjata tapahtuman tietokantaan taustalla. Lokitus kestää 50 ms — jos odotat sitä ennen vastausta, käyttäjä kokee viivettä. Päätehtävä ei saa blokata lokitukseen, mutta lokitus pitää silti suorittaa luotettavasti.

```rust
async fn handle_request(req: Request) -> Response {
    let entry = build_log_entry(&req);
    // Miten ajat log_to_db taustalla?
    build_response(req)
}
```

## Ratkaisu

Käynnistä taustatehtävä `tokio::spawn`-kutsulla:

```rust
async fn handle_request(req: Request) -> Response {
    let entry = build_log_entry(&req);

    tokio::spawn(async move {
        if let Err(e) = log_to_db(entry).await {
            eprintln!("Logitus epäonnistui: {e}");
        }
    });

    build_response(req).await
}
```

`async move` siirtää `entry`-omistajuuden spawnattuun tehtävään. Päätehtävä palaa heti; lokitus jatkuu taustalla. Virheenkäsittely spawnissa on tärkeää — paniikki tai unohdettu virhe katoaa, jos handlea ei odoteta.

CPU-raskas synkroninen työ (pakkaus, kryptografia) kuuluu `tokio::task::spawn_blocking`-pooliin, ei tavalliseen spawn:iin.

## Käytännössä

Spawnattu tehtävä vaatii `Send + 'static`: kaikki siepatut arvot on voitava siirtää säieiden välillä, eikä niissä saa olla viittauksia paikallisiin muuttujiin, joiden elinkaari päättyy ennen tehtävää. Käytä `Arc` jaettuun tilaan.

Tuotannossa harkitse JoinHandlea virheiden keräämiseen tai `JoinSet`-rakennetta useille taustatehtäville. Fire-and-forget on ok vain, jos epäonnistuminen on hyväksyttävää tai logitetaan spawnin sisällä.

[Lue lisää](https://docs.rs/tokio/latest/tokio/fn.spawn.html)

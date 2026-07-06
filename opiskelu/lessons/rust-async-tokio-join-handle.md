# tokio::spawn palauttaa JoinHandle<T>. Miten saat tehtävän tuloksen tai virheen?

## Taustaa

Kun käynnistät taustatehtävän `tokio::spawn`-kutsulla, runtime ajaa sen rinnakkain muiden async-tehtävien kanssa. Spawn ei odota valmistumista — se palauttaa heti **JoinHandle**-käsineen, joka on silta spawnattuun tehtävään. Handle mahdollistaa tuloksen odottamisen, tehtävän peruuttamisen ja virheiden käsittelyn.

JoinHandle on itse async: `.await` odottaa, kunnes taustatehtävä valmistuu. Tulos on kaksikerroksinen: `Result<T, JoinError>`, jossa sisempi `T` on tehtävän palauttama arvo ja ulompi `JoinError` kertoo, kaatuiko tehtävä paniikkiin tai peruutettiinko se.

## Tilanne

HTTP-palvelu vastaa käyttäjälle nopeasti, mutta taustalla ajetaan raskas laskenta — esimerkiksi raportin generointi. Päätehtävä spawnaa laskennan ja haluaa joko odottaa tulosta ennen vastausta tai käsitellä virheen, jos laskenta epäonnistuu.

```rust
let handle = tokio::spawn(async {
    compute_report(user_id).await
});
// Palvelin voi tehdä muuta ennen kuin odottaa tulosta
```

Ilman JoinHandlea et tietäisi, milloin taustatehtävä on valmis tai onnistuiko se.

## Ratkaisu

Kutsu `.await` JoinHandleen saadaksesi tehtävän tuloksen:

```rust
let handle = tokio::spawn(async move {
    compute().await
});

match handle.await {
    Ok(val) => println!("Tulos: {val}"),
    Err(e) => eprintln!("Tehtävä epäonnistui: {e}"),
}
```

`Ok(val)` tarkoittaa, että spawnattu async-lohko suoritettiin loppuun ja palautti `val`. `Err(e)` tarkoittaa paniikkia tehtävässä tai `abort()`-kutsua — ei välttämättä liiketoimintalogiikan virhettä (ne tulevat `Result`-tyypin kautta sisemmässä `Ok`-haarassa).

Peruutus: `handle.abort()` keskeyttää tehtävän. Myöhempi `.await` palauttaa `Err(JoinError)`.

## Käytännössä

Useita taustatehtäviä hallitset `JoinSet`-rakenteella — se kerää handleja ja odottaa niitä järjestyksessä tai satunnaisesti. Fire-and-forget -tapauksessa voit jättää handlea odottamatta, mutta silloin virheet katoavat — parempi on `tokio::spawn` + erillinen logitus `.await`-haarassa.

Spawnattu closure vaatii `Send + 'static`: kaikki siepatut arvot on voitava siirtää säieiden välillä ja niiden elinkaaren on oltava tehtävän kesto. `Arc`-jaettu tila on tyypillinen ratkaisu jaettuun dataan.

[Lue lisää](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html)

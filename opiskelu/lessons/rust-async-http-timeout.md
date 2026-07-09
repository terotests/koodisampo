# Rust-palvelu kutsuu ulkoista API:a ilman timeoutia. Mikä riski?

## Taustaa

Ilman timeoutia `Future` voi jäädä odottamaan liian pitkäksi aikaa. Rust-koodi ei välttämättä "kaadu" — se vain odottaa. Samaan aikaan requestit, connection poolit ja `tokio::spawn`-tehtävät voivat kasautua, kunnes palvelu lakkaa vastaamasta uusiin pyyntöihin.

Tämä on tyypillinen tuotantobugi: koodi on "oikein" async-tyylillä, mutta resurssirajat puuttuvat.

## Tilanne

HTTP-client kutsuu ulkoista maksupalvelua ilman aikarajaa:

```rust
async fn charge_customer(client: &reqwest::Client, id: &str) -> Result<Receipt> {
    let resp = client
        .post("https://payments.example/charge")
        .json(&ChargeRequest { customer_id: id })
        .send()
        .await?;  // ei timeoutia — voi odottaa ikuisesti
    Ok(resp.json().await?)
}
```

Maksupalvelu jumiutuu. Jokainen saapuva pyyntö jättää odottavan tehtävän käyntiin. Connection pool täyttyy. Muistin ja task-määrän kasvu näkyy tuotannossa hitautena ja lopulta palvelun kaatumisena — ilman selkeää panic-viestiä.

## Ratkaisu

- käytä `tokio::time::timeout` koko operaation ympärillä
- aseta HTTP-clientille connect- ja read-timeoutit
- retry vain **idempotenteille** operaatioille
- käytä backoffia ja jitteriä uudelleenyrityksissä

```rust
use tokio::time::{timeout, Duration};

let resp = timeout(
    Duration::from_secs(10),
    client.post(url).json(&body).send(),
)
.await??;
```

`reqwest::Client::builder().timeout(Duration::from_secs(10))` kattaa useimmat tapaukset. Yhdistä palvelutason deadline maksimiaikaan.

## Käytännössä

Timeout ei korvaa circuit breakeria — jos ulkoinen palvelu on alhaalla, rajoita rinnakkaisia kutsuja ja palauta nopeasti virhe. Mittaa odotusajat ja timeout-osumia — ne kertovat integraation terveydestä ennen kuin käyttäjät valittavat.

[Lue lisää](https://docs.rs/tokio/latest/tokio/time/fn.timeout.html)

# Async-tehtävät viestivät toisilleen tokio-runtime:ssa. Mikä kanava on async-native?

## Taustaa

Säiepohjaisessa Rustissa viestintä tapahtuu usein `std::sync::mpsc`-kanavalla — mutta sen `send` ja `recv` ovat **blokkaavia**. Async-runtime:ssa blokkaava kutsu jäädyttää koko worker-säieen, mikä estää muiden tehtävien ajamisen samalla säikeellä.

Tokio tarjoaa oman **async-native** kanavamallin `tokio::sync::mpsc`-moduulissa. Lähetys (`send`) ja vastaanotto (`recv`) ovat async-funktioita, jotka yieldaavat runtime:lle odotuksen ajaksi. Näin sama säie voi hoitaa muita tehtäviä, kun kanava on tyhjä tai täynnä.

## Tilanne

Rakennat async-palvelun, jossa yksi producer-tehtävä vastaanottaa HTTP-pyyntöjä ja lähettää työtehtäviä worker-poolille. Workerit prosessoivat tehtävät taustalla ja palauttavat tulokset. Tarvitset turvallisen tavan siirtää `Job`-structeja tehtävien välillä ilman jaettua muistia lukkojen kanssa.

Producer ei saa blokata, kun worker-pooli on tilapäisesti täynnä — sen pitää odottaa async-tavalla.

## Ratkaisu

Luo kanava kapasiteetilla ja käytä async `send` / `recv`:

```rust
use tokio::sync::mpsc;

let (tx, mut rx) = mpsc::channel(32);

tokio::spawn(async move {
    while let Some(job) = rx.recv().await {
        process(job).await;
    }
});

tokio::spawn(async move {
    tx.send(job).await.expect("receiver dropped");
});
```

Kapasiteetti (32) rajaa puskurointia: jos bufferi on täynnä, `send().await` odottaa kunnes worker vapauttaa tilaa. Tämä on **backpressure** — producer ei ylitä muistia loputtomilla viesteillä.

## Käytännössä

`tokio::sync::mpsc` sopii yhden lähettäjän ja usean vastaanottajan malliin (tai usealle kloonatulle `Sender`-käsineelle). **Broadcast** (`broadcast::channel`) toimii yhdestä lähettäjästä monelle subscriberille — hyvä tapahtumien fan-outiin. **Oneshot** (`oneshot::channel`) on kertaluonteinen vastaus: yksi viesti, yksi vastaanottaja — esim. RPC-tyyppinen pyyntö-vastaus.

Valitse kanava viestin elinkaaren mukaan: jatkuva työjono → mpsc, tapahtumajako → broadcast, yksittäinen vastaus → oneshot.

Sulje kanava lopettamalla lähettäminen: kun kaikki `Sender`-kopiot dropataan, `recv().await` palauttaa `None` ja worker-silmukka voi päättyä siististi. Tämä on tärkeä shutdown-malli palveluissa.

[Lue lisää](https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html)

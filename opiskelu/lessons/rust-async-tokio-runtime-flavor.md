# CLI-työkalu ajaa yhden async-mainin ilman rinnakkaisia worker-säikeitä. Mikä #[tokio::main] asetus?

## Taustaa

Tokio-runtimella on kaksi pääasiallista **flavor**-tyyppiä: **multi-thread** (oletus) ja **current_thread**. Multi-thread runtime luo worker-säiepoolin, joka ajaa tehtäviä rinnakkain — ihanteellinen palvelimille, joissa on paljon samanaikaisia I/O-operaatioita.

**Current_thread** runtime ajaa kaikki tehtävät yhdellä säikeellä. Se on kevyempi: ei worker-säieitä, ei synkronointia säieiden välillä. Sopii CLI-työkaluihin, yksinkertaisiin skripteihin ja testeihin, joissa rinnakkaisuudelle ei ole tarvetta.

## Tilanne

Rakennat komentorivityökalun, joka tekee yhden async HTTP-haun ja tulostaa tuloksen. Oletusarvoinen multi-thread runtime tuntuu ylimitoitetulta — se luo taustasäieitä, joita et tarvitse. CLI käynnistyy hitaammin ja kuluttaa enemmän resursseja kuin tarpeen.

```bash
my-fetch https://api.example.com/data
# Yksi pyyntö, yksi vastaus — ei samanaikaisia yhteyksiä
```

## Ratkaisu

Määritä `flavor = "current_thread"` makron attribuutissa:

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data = fetch("https://api.example.com/data").await?;
    println!("{data}");
    Ok(())
}
```

Kaikki async-tehtävät ajetaan samalla säikeellä vuorotellen. `tokio::spawn` toimii edelleen, mutta spawnatut tehtävät eivät siirry toiselle säikeelle.

Multi-thread on oletus I/O-palveluille:

```rust
#[tokio::main]  // sama kuin flavor = "multi_thread"
async fn main() { /* ... */ }
```

## Käytännössä

Lisäasetukset: `worker_threads = N` säätää multi-thread poolin kokoa. `enable_all()` runtime builderissa ottaa käyttöön I/O- ja ajastindriverit.

Testeissä `#[tokio::test(flavor = "current_thread")]` nopeuttaa yksinkertaisia testejä — deterministisempi ja kevyempi kuin multi-thread. Valitse flavor työmäärän mukaan: yksi polku → current_thread, palvelin → multi-thread.

[Lue lisää](https://docs.rs/tokio/latest/tokio/attr.main.html)

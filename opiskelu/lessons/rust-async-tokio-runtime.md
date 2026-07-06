# async main ei käänny ilman runtimea. Mikä on tyypillinen tokio-käynnistys?

## Taustaa

Rustin async-koodi kääntyy **Future**-tyypeiksi, mutta future ei aja itse itseään. Tarvitaan **executor** eli runtime, joka kutsuu futuren `poll`-metodia, kunnes se valmistuu. Tokio on yleisin runtime Rust-ekosysteemissä — se tarjoaa säiepoolin, ajastimet, I/O-multiplexauksen ja tehtävien ajoituksen.

`async fn main()` ilman runtime-makroa antaa kääntäjävirheen (E0752): `main`-funktion pitää palauttaa konkreettinen tyyppi, ei abstrakti future. `#[tokio::main]`-makro käärii async-mainin synkroniseksi `fn main()`, joka luo runtimen ja ajaa futuren loppuun.

## Tilanne

Aloitat uuden async-projektin ja lisäät `tokio`-riippuvuuden `Cargo.toml`-tiedostoon. Kirjoitat:

```rust
async fn main() {
    fetch("https://example.com").await.unwrap();
}
```

`cargo run` epäonnistuu: kääntäjä ei tiedä, miten async-main ajetaan. Tarvitset käynnistyskoodin, joka luo Tokio-runtimen.

## Ratkaisu

Lisää `#[tokio::main]`-makro ja määritä tarvittavat featuret:

```toml
# Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let body = fetch("https://example.com").await?;
    println!("{body}");
    Ok(())
}
```

Makro generoi synkronisen `main`-funktion, joka kutsuu `tokio::runtime::Runtime::block_on` async-rungoa varten. Oletuksena runtime on multi-thread — sopii I/O-painotteisiin palveluihin.

## Käytännössä

**Kirjastoissa** älä käytä `#[tokio::main]` — palauta future ja anna sovelluksen omistaa runtime. Binääreissä makro on kätevin tapa.

Edistyneessä käytössä `Runtime::builder()` antaa hallinnan worker-säieiden määrästä, stack-koosta ja I/O-driverista. `tokio::spawn`, `select!` ja `timeout` vaativat aktiivisen runtimen — ne toimivat vain async-kontekstissa.

[Lue lisää](https://docs.rs/tokio/latest/tokio/attr.main.html)

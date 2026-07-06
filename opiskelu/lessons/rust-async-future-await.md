# Mitä `async fn` palauttaa Rustissa?

## Taustaa

Rustissa asynkroninen ohjelmointi perustuu **Future**-traitiin: se kuvaa työtä, joka voi valmistua myöhemmin. `async fn` on syntaktista sokeria — kääntäjä muuttaa funktion sellaiseksi, että se palauttaa implisiittisesti `Future`-tyypin, ei suoraan laskettua arvoa. Funktion runko ajetaan vasta, kun jokin **executor** (esim. Tokio) ajaa tuon futuren `.await`-pisteisiin asti.

`await` keskeyttää async-funktion suorituksen siihen asti, kunnes sisäinen future on valmis — ilman että säie blokataan odottamaan I/O:ta. Tämä mahdollistaa **concurrencyn**: sama säie voi hoitaa satoja odottavia verkkopyyntöjä vuorotellen. Tärkeää: async ei tarkoita automaattista rinnakkaisuutta (parallelism) — se tarkoittaa tehokasta odotusten hallintaa.

## Tilanne

Rakennat HTTP-clientin, joka hakee sivun sisällön verkosta. Synkroninen koodi blokkaisi säiettä koko verkkoyhteyden ajan — palvelimella, jossa on rajallinen säiepooli, tämä tukkii nopeasti koko järjestelmän. Async-funktio sen sijaan antaa runtime:n vaihtaa toiseen tehtävään, kun verkko odottaa vastausta.

```rust
async fn fetch(url: &str) -> Result<String, Error> {
    let body = client.get(url).await?.text().await?;
    Ok(body)
}
```

Huomaat, että `fetch`-funktiota ei voi kutsua tavallisella `fetch(url)` — se ei palauta `String`-arvoa suoraan.

## Ratkaisu

`async fn fetch(...)` palauttaa **anonymisen Future-tyypin**, joka toteuttaa `Future<Output = Result<String, Error>>`. Kääntäjä generoi tilakoneen, jossa jokainen `.await` on keskeytyskohta. Future on **lazy**: mitään ei tapahdu ennen kuin se ajetaan executorin kautta.

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let body = fetch("https://example.com").await?;
    println!("{body}");
    Ok(())
}
```

`#[tokio::main]` luo runtime-ympäristön, joka ajaa `main`-funktion futuren. Ilman executoria async-koodi ei käänny tai ei aja oikein — future tarvitsee ajurin (`poll`-kutsut).

## Käytännössä

Async sopii I/O-painotteiseen koodiin: HTTP, tietokanta, tiedostot, viestijonot. CPU-raskas laskenta kuuluu yleensä `spawn_blocking`-pooliin tai erillisiin säieisiin — pelkkä async ei nopeuta laskentaa. Muista: async-funktio ei ole sama asia kuin rinnakkaisuus; se on tapa järjestää odottavaa työtä ilman säieblokkausta.

Kirjastoissa vältä `#[tokio::main]` — palauta future ja anna sovelluksen valita runtime. Testeissä käytä `#[tokio::test]`.

Voit ajaa futuren myös manuaalisesti ilman makroa: `Runtime::new()?.block_on(async { ... })`. Tämä on hyödyllistä, kun haluat hallita runtime-asetuksia tarkasti CLI-työkalussa tai testissä.

[Lue lisää](https://doc.rust-lang.org/book/ch17-01-futures-and-syntax.html)

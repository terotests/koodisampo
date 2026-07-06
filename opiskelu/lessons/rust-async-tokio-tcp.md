# Rakennat async TCP-palvelimen tokio:lla. Mikä tyyppi acceptoi yhteydet ilman blokkaavaa IO:ta?

## Taustaa

Perinteinen TCP-palvelin käyttää `std::net::TcpListener`:ia, jonka `accept()` **blokkaa** säiettä, kunnes uusi yhteys saapuu. Async-palvelimessa blokkaus tukkii worker-säieen — sama ongelma kuin synkroninen I/O muualla async-koodissa.

Tokio tarjoaa oman verkkokerroksen `tokio::net`-moduulissa. `TcpListener::bind` ja `accept` ovat async-funktioita: ne rekisteröivät odotuksen runtimeen ja yieldaavat, kunnes yhteys on valmis. Näin sama säie voi hoitaa tuhansia odottavia yhteyksiä.

## Tilanne

Rakennat yksinkertaisen echo-palvelimen, joka kuuntelee porttia 8080 ja palauttaa asiakkaan lähettämän datan takaisin. Jokainen yhteys käsitellään erikseen — tyypillinen malli on hyväksyä yhteys loopissa ja spawnaa käsittelijä taustatehtäväksi.

Synkroninen `std::net::TcpListener` ei skaalaudu Tokio-runtime:ssa ilman `spawn_blocking`-käärettä.

## Ratkaisu

Käytä `tokio::net::TcpListener`:

```rust
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("0.0.0.0:8080").await?;

    loop {
        let (socket, addr) = listener.accept().await?;
        tokio::spawn(async move {
            if let Err(e) = handle_client(socket).await {
                eprintln!("Virhe asiakkaalta {addr}: {e}");
            }
        });
    }
}

async fn handle_client(mut socket: TcpStream) -> io::Result<()> {
    let mut buf = [0u8; 1024];
    let n = socket.read(&mut buf).await?;
    socket.write_all(&buf[..n]).await?;
    Ok(())
}
```

`accept().await` odottaa uutta yhteyttä async-tavalla. Jokainen yhteys saa oman spawnatun tehtävän — palvelin jatkaa hyväksymistä heti.

## Käytännössä

Samassa moduulissa löytyvät `UdpSocket` ja `UnixListener` (Unix-domain socketit). HTTP-palvelimia rakennetaan harvoin raaka-TCP:llä — **axum**, **hyper** ja **tonic** (gRPC) rakentuvat Tokion päälle.

Tuotannossa harkitse yhteysrajoja (`Semaphore`), graceful shutdown (`select!` + signaali) ja TLS (`tokio-rustls`). Echo-esimerkki on opetusmalli; oikeissa palveluissa virheenkäsittely ja resurssirajat ovat kriittisiä.

[Lue lisää](https://docs.rs/tokio/latest/tokio/net/struct.TcpListener.html)

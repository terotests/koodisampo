# Rakennat async TCP-palvelimen tokio:lla. Mikä tyyppi acceptoi yhteydet ilman blokkaavaa IO:ta?

## Tilanne

Echo-palvelin kuuntelee porttia 8080 ja käsittelee jokaisen yhteyden spawnattuna tehtävänä.

## Ratkaisu

```rust
let listener = TcpListener::bind("0.0.0.0:8080").await?;
loop {
    let (socket, _) = listener.accept().await?;
    tokio::spawn(handle_client(socket));
}
```

## Käytännössä

UdpSocket, UnixListener samassa namespacessa. HTTP: axum/hyper tokio-päällä.

[Lue lisää](https://docs.rs/tokio/latest/tokio/net/struct.TcpListener.html)

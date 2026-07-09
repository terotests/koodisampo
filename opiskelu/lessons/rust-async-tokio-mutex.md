# Jaettu tila async-tehtävissä — `std::sync::Mutex` aiheuttaa blokkausta awaitin yli. Mikä korvaaja?

## Taustaa

Jaettu muistitila async-ohjelmoinnissa vaatii usein `Arc`-käärettä, jotta useat tehtävät voivat viitata samaan dataan. Lukko suojaa dataa mutta sen **pitää olla async-yhteensopiva**: jos pidät lukkoa ja kutsut `.await`, worker-säie blokkaantuu koko odotuksen ajaksi.

`std::sync::Mutex::lock()` on synkroninen ja blokkaava. Async-kontekstissa se on vaarallinen: lukko voi jäädä päälle `.await`-kutsun yli, mikä estää muiden tehtävien ajamisen ja voi aiheuttaa deadlockin. Tokio tarjoaa `tokio::sync::Mutex`, jonka `lock().await` yieldaa runtime:lle.

## Tilanne

Web-palvelimessa useat `tokio::spawn`-tehtävät päivittävät samaa laskuria — esimerkiksi pyyntöjen määrää tai välimuistin tilaa. Ilman lukkoa syntyy data race. `std::sync::Mutex` toimii lyhyissä kriittisissä osioissa, mutta heti kun lukon alla kutsutaan async-funktiota, koko säie jää odottamaan.

```rust
// Vaarallinen malli — älä pidä std::Mutex-lukkoa await-yli
let guard = std::sync::Mutex::new(state).lock().unwrap();
fetch_data().await;  // lukko päällä, säie blokattu
```

## Ratkaisu

Käytä `tokio::sync::Mutex` ja `Arc`:

```rust
use std::sync::Arc;
use tokio::sync::Mutex;

let state = Arc::new(Mutex::new(AppState::default()));

let state_clone = Arc::clone(&state);
tokio::spawn(async move {
    let mut guard = state_clone.lock().await;
    guard.count += 1;
    // Päästä lukko ennen awaitia, jos mahdollista
});
```

`lock().await` odottaa lukon async-tavalla. **Tärkein sääntö**: vapauta lukko ennen `.await`-kutsuja — pidä kriittinen osio mahdollisimman lyhyenä.

## Käytännössä

Samassa `tokio::sync`-moduulissa löytyvät myös `RwLock` (useita lukijoita, yksi kirjoittaja), `Semaphore` (rajoittaa samanaikaisten operaatioiden määrää) ja `Notify` (herätys odottaville tehtäville). Monissa palveluissa jaettu tila jaetaan viesteihin (mpsc) eikä jaettuun muistitilaan — viestipassing on helpompi debugata.

Jos tarvitset synkronista lukkoa lyhyeen CPU-operaatioon, harkitse `spawn_blocking`-kutsua erillisessä poolissa.

Huomaa ero `std::sync::Mutex` ja `tokio::sync::Mutex` välillä: synkroninen lukko on ok **lyhyessä** kriittisessä osiossa ilman awaitia (esim. laskurin inkrementointi). Ongelma syntyy vasta, kun lukon alla kutsutaan `.await`.

Vaikka käytät `tokio::sync::Mutex`ia, älä tee hidasta I/O:ta lukon sisällä. Async Mutex ei blokkaa worker-säiettä samalla tavalla kuin `std::sync::Mutex`, mutta se voi silti serialisoida koko sovelluksen logiikan — kaikki tehtävät odottavat lukkoa, vaikka runtime pyörittäisi muita tehtäviä.

[Lue lisää](https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html)

# Odotat useaa Futurea — ensimmäinen valmis voittaa (timeout, cancel). Mikä tokio-makro?

## Taustaa

Async-ohjelmoinnissa usein odotetaan useaa tapahtumaa samanaikaisesti: verkkoviesti, ajastin tai peruutussignaali. Ilman erityistä primitiiviä joutuisit manuaalisesti pollaamaan jokaista futurea — virhealtista ja kömpelöä.

Tokion **`select!`**-makro odottaa useaa haaraa rinnakkain ja suorittaa **ensimmäisen valmistuneen** haaran lohkon. Muut haarat peruutetaan automaattisesti (tai jätetään taustalle riippuen mallista). Tämä on perusta timeout-, peruutus- ja multiplexaus-kuvioille.

## Tilanne

WebSocket-palvelussa odotat asiakkaalta viestiä, mutta yhteys pitää katkaista, jos mitään ei tule 30 sekuntiin. Ilman `select!`:ia joudut erilliseen ajastintehtävään ja monimutkaiseen tilanhallintaan. Tarvitset selkeän "kumpi tulee ensin" -logiikan.

```rust
// Ongelma: recv() odottaa ikuisesti ilman timeoutia
let msg = socket.recv().await?;
```

## Ratkaisu

Käytä `tokio::select!` yhdistämään vastaanotto ja timeout:

```rust
use tokio::time::{sleep, Duration};

tokio::select! {
    msg = socket.recv() => {
        handle_message(msg?)?;
    }
    _ = sleep(Duration::from_secs(30)) => {
        timeout_handler();
    }
}
```

Ensimmäinen valmistuva haara voittaa. `sleep`-haara palauttaa, kun 30 sekuntia on kulunut — jos `recv` ei ole vielä valmis, timeout-haara suoritetaan.

Peruutusmalli spawnatun tehtävän kanssa:

```rust
let task = tokio::spawn(async { long_running().await });

tokio::select! {
    result = task => { /* valmistui */ }
    _ = shutdown_signal.recv() => {
        task.abort();
    }
}
```

## Käytännössä

`select!` on biased oletuksena — jos useampi haara on valmis samaan aikaan, ensimmäinen voittaa. `select! { biased; ... }` tekee järjestyksestä eksplisiittisen.

Yksinkertaiseen timeoutiin riittää usein `tokio::time::timeout(duration, future).await`. `select!` on tehokkaampi, kun haaroilla on erilaisia sivuvaikutuksia tai peruutuslogiikkaa. Vältä `select!`-silmukassa muuttujien move-ongelmia — käytä `&mut` tai jaettua tilaa tarvittaessa.

[Lue lisää](https://docs.rs/tokio/latest/tokio/macro.select.html)

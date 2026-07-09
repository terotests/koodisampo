# Struct sisältää API-avaimen ja sille deriveataan Debug. Mikä riski?

## Taustaa

`#[derive(Debug)]` on kätevä kehityksessä — se tulostaa structin kentät `println!("{:?}", config)`-kutsussa. Tuotannossa lokit ja virheilmoitukset voivat vuotaa **salaisuuksia** (API-avaimet, tokenit, salasanat) jos koko config-struct logitetaan sellaisenaan.

Rust ei redaktoi automaattisesti arkaluonteisia kenttiä. `Debug`-toteutus tulostaa kaiken, mitä derive generoi.

## Tilanne

Palvelun konfiguraatio sisältää tietokannan salasanan ja kolmannen osapuolen API-avaimen:

```rust
#[derive(Debug, Clone)]
struct AppConfig {
    database_url: String,
    api_key: String,
    port: u16,
}

fn handle_error(config: &AppConfig, err: &Error) {
    tracing::error!("Config {:?} failed: {}", config, err);
    // api_key ja database_url päätyvät tuotantolokeihin
}
```

Kehityksessä debug-tuloste auttaa. Tuotannossa sama rivi vuotaa salaisuudet lokijärjestelmään, josta ne voivat päätyä kolmansille osapuolille tai julkisiin virheilmoituksiin.

## Ratkaisu

- älä deriveaa `Debug`ia secret-tyypeille suoraan koko configissa
- tee wrapper-tyyppi `Secret<T>` tai `Redacted<String>`
- implementoi `Debug` niin, että arvo redaktoidaan (`Secret("[REDACTED]")`)
- älä logita koko request/config-structia sokkona — logita vain tarvittavat kentät

```rust
struct Secret(String);

impl std::fmt::Debug for Secret {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("[REDACTED]")
    }
}

#[derive(Debug)]
struct AppConfig {
    database_url: Secret,
    api_key: Secret,
    port: u16,
}
```

## Käytännössä

Sama riski koskee `Display`, `Serialize` (JSON-vastaukset) ja virheketjuja (`anyhow`/`Error` chain). Määrittele erikseen mitä saa näyttää käyttäjälle vs. mitä saa logittaa sisäisesti.

Code review: etsi `derive(Debug)` config- ja credential-tyypeistä. Käytä `secrecy`-cratea tai omaa wrapperia yhdenmukaisuuden vuoksi.

[Lue lisää](https://docs.rs/secrecy/latest/secrecy/)

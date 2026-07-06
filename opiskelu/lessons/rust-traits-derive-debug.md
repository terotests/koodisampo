# Haluat tulostaa structin debug-lokitukseen ilman manuaalista fmt-koodia. Mikä on nopein tapa?

## Taustaa

Kehitysvaiheessa tarvitset usein nähdä structin sisällön nopeasti — virheen jäljityksessä, testeissä tai väliaikaisissa `println!`-kutsuissa. **`Debug`-trait** määrittää, miten arvo formatoidaan debug-tulostukseen (`{:?}`).

Manuaalinen `impl Debug` on tarkka mutta työläs. Rust tarjoaa **derive-makron**, joka generoi toteutuksen automaattisesti structin ja enumien kenttien perusteella. Se on nopein tapa saada luettava debug-tuloste.

## Tilanne

Sinulla on konfiguraatio-struct, jota haluat tulostaa lokiin:

```rust
struct Config {
    host: String,
    port: u16,
    tls: bool,
}

fn main() {
    let cfg = Config {
        host: "localhost".into(),
        port: 8080,
        tls: false,
    };
    // println!("{:?}", cfg);  // VIRHE ilman Debug-toteutusta
}
```

Ilman `Debug`-toteutusta `{:?}` ei toimi. Et halua kirjoittaa `fmt`-metodia käsin jokaiselle kentälle — tarvitset nopean ratkaisun kehitystyöhön.

## Ratkaisu

Lisää `#[derive(Debug)]` structin yläpuolelle:

```rust
#[derive(Debug)]
struct Config {
    host: String,
    port: u16,
    tls: bool,
}

fn main() {
    let cfg = Config {
        host: "localhost".into(),
        port: 8080,
        tls: false,
    };
    println!("{:?}", cfg);
    // Config { host: "localhost", port: 8080, tls: false }

    println!("{:#?}", cfg);  // pretty-print, monirivinen
}
```

Derive toimii myös enumien ja sisäkkäisten structien kanssa, kun kaikilla kenttityypeillä on `Debug`.

## Käytännössä

Yleisiä derive-traitteja ovat `Clone`, `Copy`, `PartialEq`, `Eq` ja `Hash` — valitse vain tarvitsemasi. `Debug` on kehitystä varten; tuotantologeissa saatat haluta `Display`-implin tai strukturoidun lokikirjaston.

Jos struct sisältää salaisuuksia (API-avaimia, salasanoja), älä derive `Debug` sellaisenaan — kirjoita custom `impl Debug`, joka piilottaa arkaluonteiset kentät. Derive on oletus kehityksessä; tuotannossa harkitse tarkempaa formatointia.

[Lue lisää](https://doc.rust-lang.org/book/appendix-03-derivable-traits.html)

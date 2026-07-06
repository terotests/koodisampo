# Tiedoston avaus voi epäonnistua. Mikä tyyppi mallintaa onnistumisen tai virheen?

## Tilanne

Luet konfiguraatiotiedoston:

```rust
fn load_config(path: &str) -> ??? {
    // tiedosto puuttuu, oikeudet väärin, JSON rikki...
}
```

Go palauttaisi `(Config, error)`. Java heittäisi poikkeuksen. Rustissa recoverable-virheet ovat arvoja, ei poikkeuksia.

## Ratkaisu

**`Result<T, E>`** — `Ok(T)` onnistuessa, `Err(E)` virheessä:

```rust
use std::fs;
use std::io;

fn load_config(path: &str) -> Result<String, io::Error> {
    fs::read_to_string(path)
}

match load_config("app.toml") {
    Ok(content) => println!("{}", content),
    Err(e) => eprintln!("Virhe: {}", e),
}
```

Virheet kulkevat tyyppijärjestelmän kautta — kutsujan on käsiteltävä ne tai propagoitava eteenpäin.

## Käytännössä

`std::io::Result<T>` on alias `Result<T, io::Error>`. Kirjastot käyttävät omia virhetyyppeihinsä (`thiserror`, `anyhow`). `Result` + `?`-operaattori muodostaa selkeän virheketjun ilman try/catch-syntaksia.

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

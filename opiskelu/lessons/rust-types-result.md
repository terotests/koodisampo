# Tiedoston avaus voi epäonnistua. Mikä tyyppi mallintaa onnistumisen tai virheen?

## Taustaa

Ohjelmat kohtaavat jatkuvasti tilanteita, joissa jokin voi mennä pieleen: tiedosto puuttuu, verkko on poikki, syöte on virheellinen. Nämä ovat **recoverable**-virheitä — ohjelma voi yrittää uudelleen, näyttää viestin käyttäjälle tai palauttaa virheen eteenpäin.

Java ja moni muu kieli käyttää poikkeuksia (`try/catch`), joita voi unohtaa käsitellä. Go palauttaa `(arvo, error)`-parin, jossa virhe on helppo jättää huomiotta. Rustissa recoverable-virheet ovat **arvoja**, ei poikkeuksia — ne kulkevat **`Result<T, E>`**-tyypin kautta.

`Result<T, E>` on enum kahdella variantilla: `Ok(T)` onnistuneessa tapauksessa ja `Err(E)` virheessä. Kuten `Option`-tyypin kanssa, kääntäjä pakottaa sinut joko käsittelemään virheen tai propagoimaan sen eteenpäin eksplisiittisesti.

## Tilanne

Luet konfiguraatiotiedoston palvelimen käynnistyksessä:

```rust
fn load_config(path: &str) -> ??? {
    // tiedosto puuttuu, oikeudet väärin, JSON rikki...
}
```

Tiedoston avaus voi epäonnistua monesta syystä: polku on väärä, käyttäjällä ei ole lukuoikeuksia tai levy on täynnä. Funktion paluutyyppi pitää kertoa tämän — pelkkä `String` ei riitä, koska se ei erota "onnistunut luku" ja "virhe" -tiloja toisistaan.

Rustissa `???` korvataan **`Result<String, io::Error>`**-tyypillä (tai laajemmalla virhetyypillä). Kutsuja näkee heti funktion allekirjoituksesta, että virheenkäsittely on pakollista tai tarkoituksellisesti siirretty eteenpäin.

## Ratkaisu

**`Result<T, E>`** mallintaa kaksi mahdollista lopputulosta:

```rust
use std::fs;
use std::io;

fn load_config(path: &str) -> Result<String, io::Error> {
    fs::read_to_string(path)
}

match load_config("app.toml") {
    Ok(content) => println!("Konfiguraatio ladattu:\n{}", content),
    Err(e) => eprintln!("Konfiguraation luku epäonnistui: {}", e),
}
```

`fs::read_to_string` palauttaa jo valmiiksi `Result<String, io::Error>`. Sinun ei tarvitse itse rakentaa `Ok(...)` tai `Err(...)` jokaisessa haarassa, jos delegaat koko työn standardikirjastolle.

Virheet kulkevat tyyppijärjestelmän kautta. Jos unohdat käsitellä `Result`-arvon, kääntäjä varoittaa: `unused Result that must be used`. Tämä estää yleisen Go-tyylisen `_`-ignoroinnin, jossa virhe jää huomaamatta.

## Käytännössä

**`std::io::Result<T>`** on kätevä alias tyypille `Result<T, io::Error>`. Näet sen usein I/O-funktioissa. Omat moduulit määrittelevät usein oman virheenumin (`enum AppError { ... }`) ja yhdistävät eri lähteistä tulevat virheet yhdeksi tyypiksi.

Kirjastot kuten **`thiserror`** auttavat virhetyyppien määrittelyssä, ja **`anyhow`** sopii sovelluskerrokseen, jossa tarvitset joustavaa virheenkäsittelyä. Molemmat rakentuvat `Result`-tyypin päälle — perusajatus pysyy samana.

**`?`-operaattori** (ks. erillinen oppitunti) lyhentää virheiden propagoimista: `let text = fs::read_to_string(path)?;` palauttaa virheen automaattisesti funktiosta. Tuotantokoodissa `Result` + `?` muodostaa selkeän virheketjun ilman `try/catch`-syntaksia.

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)

# Milloin `unsafe`-lohko on perusteltu?

## Taustaa

Rustin oletus on **muistiturvallinen** koodi: borrow checker, null-turvallisuus ja rajatarkistukset ovat päällä. **`unsafe`** on opt-out-mekanismi: tietyissä tilanteissa kääntäjä ei voi taata turvallisuutta, ja ohjelmoija ottaa vastuun manuaalisesti. Unsafe ei poista kaikkia tarkistuksia — se sallii raw pointer -dereferoinnin, FFI-kutsut, union-kenttien lukemisen ja muut erityisoperaatiot.

Turvallinen Rust-koodi voi kutsua unsafe-koodia, mutta unsafe-koodin pitää tarjota **safe abstraktio** ulospäin. Koko ekosysteemi nojaa siihen, että `Vec`, `String` ja standardikirjasto kapseloivat unsafe-operaatiot niin, että sovellusohjelmoija ei joudu niihin koskemaan.

## Tilanne

Integroit olemassa olevan C-kirjaston Rust-projektiin. C-API palauttaa raw pointerin (`*const T`), jota pitää dereferoida. Borrow checker ei voi tietää, onko pointer validi — se riippuu C-kirjaston sopimuksesta. Ilman `unsafe`-lohkoa et voi edes kutsua C-funktiota tai lukea pointerin osoittamaa arvoa.

Toinen yleinen tapaus: suorituskykykriittinen inner loop, jossa olet todistaneet indeksien olevan turvallisia, mutta kääntäjä ei pysty päättelemään sitä.

## Ratkaisu

Merkitse unsafe-koodi eksplisiittisesti:

```rust
/// Kutsuu C-kirjaston init-funktiota — pointer validi initin jälkeen.
unsafe fn call_c_init() {
    extern "C" {
        fn c_init() -> *const Config;
    }
    let ptr = c_init();
    assert!(!ptr.is_null());
    let config = &*ptr;  // unsafe dereference
    println!("version: {}", config.version);
}

// Safe wrapper ulospäin
pub fn initialize() -> Result<Config, InitError> {
    unsafe {
        call_c_init();
        // validoi, kopioi tarvittaessa omistettuun Rust-tyyppiin
    }
    Ok(Config::default())
}
```

`unsafe fn` merkitsee funktion, joka vaatii kutsujan varmistavan esiehdot. `unsafe { ... }` -lohko merkitsee paikan, jossa kääntäjä luottaa ohjelmoijaan.

## Käytännössä

**Periaate**: pidä unsafe mahdollisimman pienenä ja kapseloitu safe API:n taakse. Dokumentoi esiehdot (`// SAFETY: ptr valid until free()`). Työkalut: **Miri** (UB-testaus), **Clippy** (unsafe-käytön varoitukset), **cargo-geiger** (unsafe-määrän seuranta).

Älä käytä unsafe suorituskyvyn vuoksi ennen kuin olet profiloinut — usein `Iterator`-ketjut ja `-O` riittävät. FFI, custom allocatorit ja zero-cost abstraktioiden toteutus ovat tyypillisiä perusteltuja syitä.

[Lue lisää](https://doc.rust-lang.org/book/ch19-01-unsafe-rust.html)

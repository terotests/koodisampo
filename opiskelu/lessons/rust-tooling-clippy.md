# Code review haluaa automatisoida Rust-tyylivihjeet CI:ssä. Mikä työkalu?

## Taustaa

Rust-kääntäjä (`rustc`) tarkistaa oikeellisuuden, mutta ei anna laajaa palautetta tyylistä, yleisistä virhemalleista tai suorituskykyvaroituksuksista. **Clippy** on Rust-projektin virallinen lint-työkalu — se analysoi koodia ja ehdottaa parannuksia: turhat `clone()`-kutsut, tehoton silmukkarakenne, turhat `format!`-ketjut ja paljon muuta.

Clippy asennetaan rustup-komponenttina (`rustup component add clippy`) ja ajetaan Cargon kautta. Se on erillinen **rustfmt**:stä, joka hoitaa automaattisen muotoilun — molemmat kuuluvat CI-putkeen, mutta tekevät eri työtä.

## Tilanne

Pull requesteissa toistuu sama palaute: turhia `.clone()`-kutsuja, `let x = x`-shadowingia ja `match`-haaroja, jotka voisi korvata `if let`:llä. Code review vie aikaa samoista asioista. Tiimi haluaa automatisoida tarkistukset ennen mergeä — virheestä CI failaa.

Manuaalinen tarkistus ei skaalaudu kasvavassa tiimissä.

## Ratkaisu

Aja Clippy CI:ssä ja käsittele varoitukset virheinä:

```bash
cargo clippy --all-targets --all-features -- -D warnings
```

`-D warnings` muuttaa varoitukset virheiksi — build failaa, jos Clippy löytää ongelmia. Paikallisesti:

```bash
cargo clippy --fix              # ehdottaa automaattikorjauksia
cargo clippy -- -W clippy::pedantic  # tiukempi (valinnainen)
```

Poikkeukset perustellusti attribuutilla:

```rust
#[allow(clippy::too_many_arguments)]
fn legacy_api(/* ... */) { }
```

## Käytännössä

Yhdistä CI-putkessa: `cargo fmt --check` (muotoilu) + `cargo clippy` (lint) + `cargo test`. Pre-commit-hookki nopeuttaa palautetta ennen pushia.

`-D warnings` on hyvä tiimiprojekteissa, mutta ota se käyttöön tietoisesti — toolchain-päivitys voi tuoda uusia Clippy-varoituksia ja rikkoa CI:n.

`clippy::pedantic` ja `clippy::nursery` ovat tiukempia — ota käyttöön vähitellen. Clippy ei korvaa code reviewta kokonaan, mutta poistaa mekaanisen toiston. Päivitä Clippy toolchainin mukana säännöllisesti — uusia linttejä tulee jokaisessa Rust-julkaisussa.

Esimerkkejä hyödyllisistä Clippy-linteistä: `clippy::unnecessary_to_owned` (turha `.to_string()`), `clippy::needless_borrow` (turha `&`), `clippy::match_wild_err_arm` (liian laaja virheenkäsittely). Korjaukset parantavat usein sekä luettavuutta että suorituskykyä.

[Lue lisää](https://doc.rust-lang.org/clippy/)

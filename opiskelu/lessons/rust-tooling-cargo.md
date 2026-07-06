# Uusi Rust-projekti aloitetaan terminaalissa. Mikä komento luo `Cargo.toml`-projektin?

## Taustaa

Rust-ekosysteemin keskus on **Cargo** — virallinen build-järjestelmä, riippuvuuksien hallinta ja paketointityökalu. Se kääntää koodin, ajaa testit, generoi dokumentaation ja julkaisee crateja crates.io:hon. `rustc` kääntää yksittäisiä tiedostoja, mutta käytännön projekteissa lähes kaikki kulkee Cargon kautta.

Cargo luo projektirakenteen automaattisesti: `Cargo.toml` (metatiedot ja riippuvuudet), `src/main.rs` tai `src/lib.rs` (lähdekoodi) ja `.gitignore`. `Cargo.lock` lukitsee tarkat riippuvuuksien versiot sovellusprojekteissa toistettavien buildien varmistamiseksi.

## Tilanne

Tiimi aloittaa uuden komentorivityökalun. Tarvitaan projektirakenne, riippuvuuksien hallinta ja testikomennot — ei pelkkä yksittäisen `.rs`-tiedoston manuaalinen kääntö `rustc main.rs`. Kehittäjä avaa terminaalin ja miettii ensimmäistä komentoa.

```bash
# Miten aloitat?
??? my-tool
```

Ilman Cargo-projektia riippuvuuksien hallinta, testit ja CI-integraatio jäävät manuaaliseksi.

## Ratkaisu

**Cargo** luo projektin komennolla `cargo new`:

```bash
cargo new my-tool        # binääriprojekti (src/main.rs)
cargo new --lib my-lib   # kirjastoprojekti (src/lib.rs)
cd my-tool
cargo build              # kääntää debug-moodissa
cargo test               # ajaa testit
cargo run                # build + aja
```

`Cargo.toml` määrittää paketin nimen, version, riippuvuudet (`[dependencies]`) ja metatiedot. Esimerkki:

```toml
[package]
name = "my-tool"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
```

## Käytännössä

`rustup` hallitsee toolchainia (`rustc`, `cargo`, `rustfmt`, `clippy`). Yksittäiseen tiedostoon: `rustc main.rs` riittää kokeiluun. Kaikkeen muuhun: Cargo.

CI:ssä tyypillisesti `cargo test --locked` varmistaa, että `Cargo.lock` on ajan tasalla. Monorepoissa workspace (`[workspace]` Cargo.toml:ssa) hallitsee useita crateja yhdessä. Julkaisu: `cargo publish` crates.io:hon (vaatii tilin ja version bumpin).

[Lue lisää](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html)

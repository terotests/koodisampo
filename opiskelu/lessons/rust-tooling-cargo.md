# Uusi Rust-projekti aloitetaan terminaalissa. Mikä komento luo `Cargo.toml`-projektin?

## Tilanne

Tiimi aloittaa uuden CLI-työkalun. Tarvitaan projektirakenne, riippuvuuksien hallinta ja testikomennot — ei pelkkä yksittäisen `.rs`-tiedoston kääntö.

```bash
# Miten aloitat?
??? my-tool
```

## Ratkaisu

**Cargo** on Rustin virallinen build- ja paketinhallintatyökalu:

```bash
cargo new my-tool        # binääriprojekti (src/main.rs)
cargo new --lib my-lib   # kirjastoprojekti (src/lib.rs)
cd my-tool
cargo build              # kääntää
cargo test               # ajaa testit
cargo run                # build + aja
```

`Cargo.toml` määrittää paketin nimen, version, riippuvuudet (`[dependencies]`) ja metatiedot. `Cargo.lock` lukitsee tarkat versiot sovellusprojekteissa.

## Käytännössä

`rustup` hallitsee toolchainia (`rustc`, `cargo`, `rustfmt`). Yksittäiseen tiedostoon: `rustc main.rs`. Kaikkeen muuhun: Cargo. CI:ssä tyypillisesti `cargo test --locked` varmistaa toistettavat buildit.

[Lue lisää](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html)

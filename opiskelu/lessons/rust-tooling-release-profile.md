# Tuotantobinary on liian hidas debug-buildista. Mikä Cargo-komento?

## Taustaa

Cargo kääntää oletuksena **debug-profiililla** (`dev`): optimoinnit ovat pois päältä, debug-symbolit mukana, käännös nopea. Debug-binary on helppo debugata, mutta **hidas ajossa** — joskus 10–100× hitaampi kuin optimoitu versio. Tuotantoon ja suorituskykybenchmarkiin tarvitaan **release-profiili**.

Release-profiili (`[profile.release]` Cargo.toml:ssa) ottaa käyttöön optimoinnit (`opt-level = 3`), poistaa debug-symbolit oletuksena ja voi käyttää link-time optimointia (LTO). Käännös kestää kauemmin, mutta binary on nopeampi ja pienempi.

## Tilanne

Kehität laskentaan painottuvaa CLI-työkalua. Benchmark debug-buildilla näyttää 850 ms per operaatio — odotit alle 100 ms. Profilointi osoittaa, ettei ongelma ole algoritmissa vaan siinä, että testaat vahingossa debug-binaryä tuotantokäytön sijaan.

```bash
cargo run -- benchmark-data.json
# Käyttää debug-profiilia — hidas
```

## Ratkaisu

Käännä ja aja release-moodissa:

```bash
cargo build --release
cargo run --release -- benchmark-data.json
```

Release-binary syntyy `target/release/`-hakemistoon (debug: `target/debug/`). CI:ssä erilliset jobit: testit debugilla (nopea käännös), benchmark release:llä.

Hienosäädöt `Cargo.toml`:ssa:

```toml
[profile.release]
lto = true              # link-time optimization
codegen-units = 1       # parempi optimointi, hitaampi käännös
strip = true            # pienempi binary (symbolit pois)
```

## Käytännössä

`cargo bench` käyttää release-profiilia oletuksena (tai `bench`-profiilia). Kehityksessä debug on oikein — nopea iterointi. Tuotantoon deploy: aina `--release`.

`opt-level = "s"` tai `"z"` pienentää binary-kokoa suorituskyvyn kustannuksella — hyvä upotetuille. Profiloi ennen ja jälkeen: `cargo install flamegraph` tai `perf`. Debug-assertions (`debug_assert!`) poistetaan release-buildista automaattisesti.

Voit määrittää myös `[profile.dev]`- ja `[profile.test]`-profiilit erikseen — esimerkiksi `opt-level = 1` dev-buildissa nopeuttaa debuggausta hieman ilman täyttä release-käännöstä. Tuotantoon deployattava binary tulee aina `--release`-buildista.

[Lue lisää](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html#building-to-release)

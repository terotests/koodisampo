# Code review haluaa automatisoida Rust-tyylivihjeet CI:ssä. Mikä työkalu?

## Tilanne

PR:ssä toistuvia `clone()`-varoituksia ja turhia `let x = x`-rivejä.

## Ratkaisu

```bash
cargo clippy -- -D warnings
```
Estää merge jos clippy-varoitus. rustfmt erikseen.

## Käytännössä

allow attributes vain perustellusti. clippy::pedantic valinnainen tiukempaan.

[Lue lisää](https://doc.rust-lang.org/clippy/)

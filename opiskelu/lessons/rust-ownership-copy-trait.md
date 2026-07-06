# Miksi `let b = a;` toimii `i32`:lle mutta ei `String`:lle ilman `.clone()`?

## Tilanne

Yrität jakaa arvon kahdelle muuttujalle:

```rust
let a = 5;
let b = a;  // OK

let s = String::from("hi");
let t = s;    // s invalidoituu
```

## Ratkaisu

**Copy**-trait merkitsee tyypit, jotka kopioituvat bittitasolla (i32, bool, char). **Move** koskee tyyppejä, joilla on heap-data tai omistajuuslogiikka — `String`, `Vec`, `Box`.

## Käytännössä

Älä derive Copy suurille structeille. Käytä `.clone()` kun tarvitset eksplisiittisen kopion heap-tyypeille.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#stack-only-data-copy)

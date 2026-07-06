# Haluat siirtää suuren structin heapille ilman `new`/`delete`-paria. Mikä tyyppi?

## Tilanne

Rekursiivinen tietorakenne tai suuri olio stackissa aiheuttaa overflow-riskin tai monimutkaisen omistajuuden.

## Ratkaisu

```rust
let b = Box::new(LargeStruct { /* ... */ });
// Omistajuus siirtyy Box:in mukana; drop vapauttaa heapin
```
Box on yksittäinen omistaja heap-muistissa — kuin `unique_ptr` C++:ssa.

## Käytännössä

Box on myös yleinen dyn Trait -objektien (`Box<dyn Trait>`) ja rekursiivisten tyyppien (linkitetty lista) perusta.

[Lue lisää](https://doc.rust-lang.org/book/ch15-01-box.html)

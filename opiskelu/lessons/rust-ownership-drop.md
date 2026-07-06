# Milloin Rust vapauttaa heap-muistin `String`-oliosta automaattisesti?

## Tilanne

C++:ssa `delete` tai smart pointer vapauttaa muistin. Java/C# luottaa GC:hen. Rust-aloittelija etsii `free()`-kutsua tai GC-asetusta — niitä ei ole.

```rust
{
    let s = String::from("data");
    // käytä s:ää
}  // mitä tapahtuu täällä?
```

## Ratkaisu

Kun muuttuja **poistuu scopesta**, Rust kutsuu automaattisesti **`Drop`-traitin** toteutusta. `String` vapauttaa heap-puskurinsa samalla tavalla kuin C++:n destructor:

```rust
{
    let s = String::from("data");
}  // drop(s) ajetaan implisiittisesti — muisti vapautuu

// Move siirtää drop-vastuun:
let a = String::from("x");
let b = a;  // a invalidoituu — drop(b) vapauttaa, ei drop(a)
```

Ei roskienkeruuta, ei manuaalista `free()`:ä. RAII on oletus.

## Käytännössä

Voit toteuttaa `Drop` omille tyypeillesi tiedostojen sulkemiseen, lukon vapauttamiseen jne. `std::mem::forget` estää dropin — käytä vain tarkoituksella. `Copy`-tyypit (i32, bool) eivät aja Dropia siirron jälkeen samalla tavalla kuin heap-tyypit.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)

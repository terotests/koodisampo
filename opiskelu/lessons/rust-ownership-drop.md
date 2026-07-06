# Milloin Rust vapauttaa heap-muistin `String`-oliosta automaattisesti?

## Taustaa

Muistinhallinta on yksi yleisimmistä bugilähteistä C/C++-ohjelmoinnissa: `malloc` ilman `free`, double free, roikkuvat viittaukset. Java ja C# ratkaisevat ongelman roskienkeruulla (GC): muisti vapautuu, kun ajuri ei enää viittaa objektiin — ajankohta on epämääräinen.

Rust käyttää **RAII**-mallia (Resource Acquisition Is Initialization): resurssi sidotaan muuttujan elinkaareen. Kun muuttuja poistuu scopesta, destructor ajetaan automaattisesti. Ei GC:tä, ei manuaalista `free()`:ä — mutta vapautus tapahtuu deterministisesti ja ennalta arvattavasti.

## Tilanne

C++:ssa `delete` tai smart pointer (`unique_ptr`) vapauttaa muistin. Java/C#-kehittäjä etsii `free()`-kutsua, GC-asetusta tai `finalize`-metodia — Rustissa niitä ei ole:

```rust
{
    let s = String::from("data");
    // käytä s:ää — heap-puskuri on allokoitu
}  // mitä tapahtuu täällä?
```

Kun sulkeva aaltosulje `}` suoritetaan, `s` "kuolee". Heap-muisti vapautuuko? Kuka vapauttaa? Entä jos siirsin `s`:n toiseen muuttujaan aiemmin?

## Ratkaisu

Kun muuttuja **poistuu scopesta**, Rust kutsuu automaattisesti **`Drop`-traitin** toteutusta. `String`:n `drop` vapauttaa heap-puskurin — vastaava C++:n destructorille:

```rust
{
    let s = String::from("data");
    // s omistaa heap-puskurin
}  // drop(s) ajetaan implisiittisesti — muisti vapautuu

// Move siirtää drop-vastuun:
let a = String::from("x");
let b = a;  // a invalidoituu — drop(a) EI ajeta
// ...
}  // vain drop(b) vapauttaa heapin
```

Jokaisella omistetulla tyypillä on enintään yksi drop-kutsu elinkaarensa lopussa. Siirto (`move`) siirtää drop-vastuun uudelle omistajalle; alkuperäistä ei dropata, koska se ei enää omista mitään. Tämä estää double freen.

Voit toteuttaa `Drop` omille tyypeillesi:

```rust
struct TempFile { path: String }

impl Drop for TempFile {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.path);
    }
}
// tiedosto poistuu automaattisesti kun TempFile poistuu scopesta
```

## Käytännössä

`Drop` ajetaan aina, paitsi jos kutsut `std::mem::forget(value)` — jolloin muistia ei vapauteta tarkoituksella (esim. FFI-rajapinnassa). Älä käytä `forget` vahingossa; se on harvinainen työkalu.

`Copy`-tyypit (`i32`, `bool`) eivät toteuta merkittävää `Drop`-logiikkaa — ne ovat pelkkää stack-dataa. Heap-tyypeillä (`String`, `Vec`, `Box`) drop on kriittinen: ilman sitä vuotaisit muistia jokaisella scope-päättelyllä.

Järjestys: struct-kentät dropataan kenttien deklarointijärjestyksessä käänteisesti; paikalliset muuttujat scopesta poistuessa viimeisimmästä ensimmäiseen. Tämä on tärkeää, jos drop-ketjussa on riippuvuuksia (esim. lukko vapautuu ennen kuin sen suojaama data tuhoutuu).

Ei roskienkeruuta, ei manuaalista `free()`:ä. RAII on oletus — ja borrow checker varmistaa, ettei kukaan viittaa dataan sen dropin jälkeen.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)

# Haluat siirtää suuren structin heapille ilman `new`/`delete`-paria. Mikä tyyppi?

## Taustaa

Ohjelman muisti jakautuu karkeasti **stackiin** (nopea, rajallinen koko, automaattinen elinkaari) ja **heapiin** (dynaaminen koko, manuaalinen/allokointi kautta allocatorin). Stack-muuttujat ovat oletusarvo Rustissa: `let x = 5` ja pienet structit elävät stackissa.

Suuret tai rekursiiviset rakenteet eivät mahdu turvallisesti stackiin, tai niiden koko ei ole tiedossa käännösaikana. C++:ssa käytät `new`/`delete` tai `std::make_unique`. Rustissa vastaava on **`Box<T>`** — yksittäinen omistaja heap-allokaatiolla, ilman erillistä `delete`-kutsua.

## Tilanne

Rekursiivinen tietorakenne (linkitetty lista, puu) tai suuri struct stackissa aiheuttaa ongelmia:

```rust
// Tämä EI käänny — rekursiivinen tyyppi tarvitsee indirektion
// enum List { Cons(i32, List), Nil }

struct LargeBuffer {
    data: [u8; 1_000_000],  // megatavu stackissa — stack overflow -riski
}
// let huge = LargeBuffer { ... };  // vaarallista suurilla kooilla
```

Rust ei salli tietämättömän kokoisia arvoja stackissa samalla tavalla kuin C sallii VLA:t. Rekursiivinen tyyppi tarvitsee osoittimen — muuten kääntäjä ei tiedä structin kokoa.

## Ratkaisu

**`Box<T>`** allokoi arvon heapiin ja pitää sen stackissa olevan osoittimen kautta. Omistajuus on yksi: kun `Box` dropataan, heap-muisti vapautuu automaattisesti.

```rust
// Rekursiivinen linkitetty lista
enum List {
    Cons(i32, Box<List>),
    Nil,
}

let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))));

// Suuri struct heapille
let b = Box::new(LargeBuffer { data: [0; 1_000_000] });
// b on osoitin stackissa (~8 tavua), data heapissa
// drop(b) vapauttaa heap-allokaation
```

`Box` on kuin C++:n `std::unique_ptr`: yksi omistaja, ei jaettua omistajuutta (siihen `Rc`/`Arc`). Siirto (`move`) siirtää Boxin ja sen heap-sisällön uudelle omistajalle halvalla — vain osoitin kopioidaan stackissa, ei koko megatavuista puskuria.

## Käytännössä

`Box` on perusta monille Rust-rakenteille:

- **Rekursiiviset tyypit** — `Cons(i32, Box<List>)` katkaisee äärettömän koon
- **Trait-objektit** — `Box<dyn Display>` dynaamiselle polymorfismille
- **Suuret arvot** — siirrä heapille stack overflowin välttämiseksi
- **Omistajuuden siirto FFI:hin** — anna C-koodille omistus Boxin kautta

`Box` ei ole "oletusratkaisu kaikelle heap-datalle". Tavallinen `String` ja `Vec` allokoivat jo heapissa sisäisesti — et tarvitse `Box<String>`. Käytä Boxia, kun tarvitset eksplisiittisen osoittimen, rekursion tai trait-objektin.

Muistin vapautus: kun `Box` poistuu scopesta, `Drop` kutsuu deallocatoria. Ei `delete b` — RAII hoitaa. Jos tarvitset jaettua omistajuutta, katso `Rc<T>` (single-thread) tai `Arc<T>` (thread-safe) — ne ovat eri työkaluja kuin Box.

[Lue lisää](https://doc.rust-lang.org/book/ch15-01-box.html)

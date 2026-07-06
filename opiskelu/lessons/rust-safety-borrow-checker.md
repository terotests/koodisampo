# Mikä Rustin ominaisuus estää data race -virheet käännösaikana ilman roskienkeruuta?

## Tilanne

Tuotantobugi C++:ssa: kaksi säiettä kirjoittaa samaan `std::vector`-iin ilman lukkoa — satunnainen segfault. TSan löytää ongelman vasta testauksessa. Tiimi pohtii, miten Rust eroaa.

## Ratkaisu

**Borrow checker** on kääntäjävaihe, joka tarkistaa omistajuus- ja lainaussäännöt:

- Yksi omistaja kerrallaan (tai hallittu jaettu omistus `Arc` + `Mutex`)
- Useita `&`-lainauksia TAI yksi `&mut` — ei molempia samaan dataan
- Lainaukset eivät elä omistajaa pidempään (lifetime-säännöt)

Näillä säännöillä **data race** (samanaikainen kirjoitus + luku/kirjoitus ilman synkronointia) on compile-time -virhe — ei tarvita GC:tä eikä runtime-tarkistusta.

```rust
let mut v = vec![1, 2, 3];
let r = &v;
v.push(4);  // KÄÄNTÄJÄVIRHE — roikkuva viittaus estetty
println!("{}", r);
```

## Käytännössä

Borrow checker oppii aikaa vieväksi aluksi, mutta se korvaa suuren osan muistiturvallisuusluokasta. `unsafe`-lohkoilla voi poistaa tarkistuksia — vastuu siirtyy ohjelmoijalle. `Send` / `Sync` varmistavat säie-turvallisuuden tyypitasolla.

[Lue lisää](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)

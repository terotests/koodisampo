# Miksi `let b = a;` toimii `i32`:lle mutta ei `String`:lle ilman `.clone()`?

## Taustaa

Rustissa `let b = a;` ei tarkoita aina samaa asiaa. Kääntäjä päättää, tapahtuuko **siirto** (move) vai **kopiointi** (copy) tyypin mukaan. Tämä poikkeaa Java- ja Python-maailmasta, jossa primitiivit ja objektiviittaukset käyttäytyvät eri tavoin mutta `String`-tyyppinen data jaetaan viittauksina.

Rust tekee valinnan eksplisiittiseksi: pienet, stack-only-tyypit kopioituvat automaattisesti `Copy`-traitin ansiosta. Heap-dataa sisältävät tyypit siirretään oletuksena — ja alkuperäinen muuttuja invalidoituu.

## Tilanne

Yrität jakaa arvon kahdelle muuttujalle samalla syntaksilla:

```rust
let a = 5;
let b = a;  // OK — a kelpaa yhä
println!("{}", a);  // 5

let s = String::from("hi");
let t = s;    // move — s invalidoituu
// println!("{}", s);  // KÄÄNTÄJÄVIRHE: value used after move
```

Miksi `i32` toimii mutta `String` ei? Molemmissa käytit samaa `let b = a` -syntaksia, mutta kääntäjä tulkitsee ne eri tavalla. Aloittelijalle tämä on yleinen hämmennys: "Miksi toinen toimii ja toinen ei?"

## Ratkaisu

**Copy**-trait merkitsee tyypit, jotka kopioituvat bittitasolla stackissa — kopio on halpa ja vanha arvo jää voimaan. Tyypillisiä `Copy`-tyyppejä: `i32`, `u64`, `bool`, `char`, `f64`, `(T, U)` kun molemmat ovat Copy, ja pienet arrayt Copy-tyypeistä.

**Move** koskee tyyppejä, joilla on heap-data, omistajuuslogiikka tai jotka eivät toteuta `Copy`-traitia: `String`, `Vec<T>`, `HashMap`, `Box<T>`, omat structit joissa on omistettuja kenttiä.

```rust
// Copy — molemmat kelpaavat
let x = 42;
let y = x;
println!("{} {}", x, y);  // OK

// Move — vain t kelpaa
let s = String::from("hello");
let t = s;
println!("{}", t);   // OK
// println!("{}", s); // virhe
```

`Copy` on ali-trait `Clone`-traitille: Copy-tyypit kloonataan yksinkertaisesti kopioimalla bitit. `String` toteuttaa `Clone` (syvä kopio heapista), mutta **ei** `Copy` — koska kopiointi olisi kallista ja kaksinkertainen `free()` olisi vaarallista, jos molemmat kopiot luultaisiin omistajiksi.

## Käytännössä

Älä derive `Copy` suurille structeille tai tyypeille, joissa on `String`, `Vec` tai muuta heap-dataa. `Copy` tarkoittaa "halpa bittikopio" — jos struct sisältää omistettua dataa, Copy olisi väärä semantiikka. Käytä `.clone()` kun tarvitset eksplisiittisen kopion heap-tyypeille.

Kun kääntäjä sanoo `cannot move out of` tai `value used after move`, tarkista onko tyyppi Copy. Jos ei, vaihtoehdot ovat: lainaus (`&T`), siirto (hyväksy että alkuperäinen invalidoituu), tai `.clone()`. Java-kehittäjälle: ajattele `Copy` ≈ primitiivit arvona, `move` ≈ objektin omistajuuden luovutus (ei viite).

Huomaa: `Copy` ei estä movea kaikissa tilanteissa — esimerkiksi `Copy`-tyyppi paketissa `Option<NonCopy>` siirtyy silti movena. Mutta perustapauksessa `let b = a` Copy-tyypeille on kopiointi, muille move.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#stack-only-data-copy)

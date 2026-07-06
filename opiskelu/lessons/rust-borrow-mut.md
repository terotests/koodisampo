# Code review: sama vektori on sekä `&mut` että `&` samassa scope:ssa. Miksi kääntäjä hylkää?

## Tilanne

Code reviewissa löytyy:

```rust
let mut items = vec![1, 2, 3];
let first = &items[0];       // jaettu lainaus
items.push(4);               // muokkaava kutsu — vektori voi reallokoida
println!("{}", first);       // first saattaisi osoittaa invalidiin muistiin
```

Tai suoraan:

```rust
let r1 = &items;
let r2 = &mut items;  // KÄÄNTÄJÄVIRHE
```

## Ratkaisu

Borrow checkerin sääntö: **yksi muokkaava lainaus (`&mut`) TAI useita jaettuja lainauksia (`&`)** — ei molempia samaan dataan samaan aikaan. Tämä estää data race -virheet ja roikkuvat viittaukset (kuten yllä `push` + `&items[0]`).

```rust
let mut items = vec![1, 2, 3];
{
    let first = &items[0];
    println!("{}", first);
}  // lainaus päättyy ennen pushia
items.push(4);
```

## Käytännössä

Jos tarvitset sekä luku- että kirjoitusoikeutta eri osiin, harkitse indeksointia, `split_at_mut`-jakoa tai sisäistä mutabiliteettia (`RefCell`, `Mutex`). Borrow checker pakottaa suunnittelemaan lainaukset selkeästi — tämä on feature, ei este.

[Lue lisää](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

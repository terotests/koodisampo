# Code review: sama vektori on sekä `&mut` että `&` samassa scope:ssa. Miksi kääntäjä hylkää?

## Taustaa

Rustin lainaussäännöt estävät **data race** -virheet ja roikkuvat viittaukset käännösaikana. Perussääntö: voit joko lainata dataa useita kertoja **vain lukuun** (`&T`), tai **kerran muokkaukseen** (`&mut T`) — ei molempia samaan dataan samaan aikaan.

Java-kehittäjälle: ajattele kuin `synchronized`-lukko, mutta kääntäjä pakottaa sen staattisesti. Pythonissa GIL piilottaa osan ongelmista; Rust paljastaa ne heti käännöksessä. C++:ssa samat virheet ovat määrittelemätöntä käytöstä — Rust kieltää ne.

## Tilanne

Code reviewissa löytyy koodi, joka näyttää harmittomalta mutta on vaarallinen:

```rust
let mut items = vec![1, 2, 3];
let first = &items[0];       // jaettu lainaus (&)
items.push(4);               // muokkaava kutsu — tarvitsee &mut items
println!("{}", first);       // first saattaisi osoittaa invalidiin muistiin
```

Tai suoraan kaksi lainausta:

```rust
let mut items = vec![1, 2, 3];
let r1 = &items;              // jaettu lainaus
let r2 = &mut items;          // KÄÄNTÄJÄVIRHE — cannot borrow as mutable
```

Miksi kääntäjä hylkää? `push` tarvitsee muokkaavan lainauksen koko vektoriin — se voi reallokoida puskurin. Samaan aikaan `first` viittaa elementtiin vanhassa puskurissa. Tulos olisi roikkuva viittaus — klassinen C++-bugi, jota Rust estää.

## Ratkaisu

Borrow checkerin sääntö: **yksi muokkaava lainaus (`&mut`) TAI useita jaettuja lainauksia (`&`)** — ei molempia samaan dataan päällekkäin samassa scope:ssa.

```rust
let mut items = vec![1, 2, 3];

// Ratkaisu 1: rajaa jaetun lainauksen elinaika
{
    let first = &items[0];
    println!("{}", first);
}  // first invalidoituu — lainaus päättyy
items.push(4);  // OK — ei päällekkäisiä lainauksia

// Ratkaisu 2: muokkaa ensin, lainaa sitten
items.push(4);
let first = &items[0];
println!("{}", first);
```

Non-lexical lifetimes (NLL) modernissa Rustissa: lainaus päättyy viimeiseen **käyttöön**, ei välttämättä scope-sulkeeseen — mutta periaate on sama. Et voi pitää `&items[0]` elossa `push`-kutsun aikana.

## Käytännössä

Jos tarvitset sekä luku- että kirjoitusoikeutta eri osiin samasta rakenteesta, harkitse:

- **Indeksointia** viittausten sijaan (`items[i]` uudelleen pushin jälkeen)
- **`split_at_mut`** — jaa slice kahteen muokattavaan osaan turvallisesti
- **Sisäistä mutabiliteettia** (`RefCell`, `Mutex`) kun säännöt ovat liian tiukat mutta logiikka on turvallinen

Borrow checker pakottaa suunnittelemaan lainaukset selkeästi — tämä on feature, ei este. Moni C++-ohjelma toimii "onnesta" kun vektoria muokataan viittausten ollessa elossa; Rust vaatii korjaamaan kuvion heti.

Muista: `&mut` takaa eksklusiivisuuden — kukaan muu ei voi lukea tai kirjoittaa samaan dataan samaan aikaan. Tämä on sama periaate kuin mutex-lukko, mutta ilman runtime-kustannusta staattisesti todistettavissa tapauksissa.

[Lue lisää](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

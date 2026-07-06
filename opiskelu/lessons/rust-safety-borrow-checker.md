# Mikä Rustin ominaisuus estää data race -virheet käännösaikana ilman roskienkeruuta?

## Taustaa

Monissa kielissä muistiturvallisuus tarkistetaan **ajonaikana**: roskienkeruu, runtime-tarkistukset tai työkalut kuten ThreadSanitizer. Rustissa suuri osa muistiturvallisuudesta ratkaistaan **käännösaikana** omistajuus- ja lainaussääntöjen avulla. Kääntäjä hylkää ohjelmat, jotka rikkovat näitä sääntöjä — ennen kuin binary ajetaan.

**Borrow checker** (lainaustarkistin) on kääntäjävaihe, joka analysoi viittaukset ja omistajuuden siirrot. Se ei vaadi GC:tä eikä runtime-lisäkustannuksia. Data race — samanaikainen kirjoitus ja luku/kirjoitus ilman synkronointia — on Rustissa compile-time -virhe, kun säännöt noudatetaan.

## Tilanne

Tuotantobugi C++-projektissa: kaksi säiettä kirjoittaa samaan `std::vector`-iin ilman lukkoa. Bugi ilmenee satunnaisena segfaultina — ThreadSanitizer löytää sen vasta testauksessa, ja tuotannossa se voi olla harvinainen mutta tuhoisa. Tiimi pohtii, miten Rust eroaa ja voiko vastaava virhe edes kääntyä.

```cpp
// C++: kääntyy, kaatuu ajonaikana
std::vector<int> v;
// thread 1: v.push_back(1);
// thread 2: v.push_back(2);  // data race
```

## Ratkaisu

Borrow checker pakottaa seuraavat säännöt:

- Yksi omistaja kerrallaan (tai hallittu jaettu omistus `Arc` + `Mutex`/`RwLock`)
- Useita `&`-lainauksia **tai** yksi `&mut` — ei molempia samaan dataan samaan aikaan
- Lainaukset eivät elä omistajaa pidempään (lifetime-säännöt)

```rust
let mut v = vec![1, 2, 3];
let r = &v;
v.push(4);  // KÄÄNTÄJÄVIRHE — roikkuva viittaus estetty
println!("{}", r[0]);
```

Kääntäjä estää tilanteen, jossa `r` viittaa vektoriin, mutta `push` voi invalidoida muistin. Tämä on klassinen roikkuvan viittauksen esto — sama luokka virheitä, joka aiheuttaa segfaulteja C/C++:ssa.

## Käytännössä

Borrow checker tuntuu aluksi tiukalta, mutta se korvaa suuren osan muistiturvallisuusluokasta ilman runtime-kustannuksia. `unsafe`-lohkoilla voi ohittaa tarkistuksia — vastuu siirtyy ohjelmoijalle. Säieiden välisessä jaossa `Send` ja `Sync` -traitit varmistavat, että tyypit ovat turvallisia jaettavaksi säieiden kesken.

Opettele virheilmoitukset: ne kertovat usein suoraan, mikä lainaus rikkoo sääntöjä ja miten korjata (esim. `clone()`, lyhyempi lainauksen elinkaari, `Arc`).

Borrow checker ei estä kaikkia bugeja — logiikkavirheet ja deadlocks lukkojen kanssa ovat edelleen mahdollisia. Se poistaa kuitenkin kokoluokan muistivirheitä, jotka ovat yleisiä säieistetyssä C/C++-koodissa.

[Lue lisää](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)

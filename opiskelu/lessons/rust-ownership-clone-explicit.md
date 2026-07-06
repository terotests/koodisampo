# Tarvitset kaksi itsenäistä kopioita samasta `Vec<i32>`:stä. Mikä on oikea tapa?

## Tilanne

Kaksi funktiota muokkaa samaa vektoria erikseen — lainaus ei riitä, tarvitaan kaksi omistettua kopiota.

## Ratkaisu

```rust
let a = vec![1, 2, 3];
let b = a.clone();  // syvä kopio
// a ja b ovat riippumattomia
```
Clone on tarkoituksellinen — kustannus näkyy koodissa.

## Käytännössä

Vältä turhaa clonea: usein riittää lainaus tai siirto. Clone kun tarvitset todella erillisen kopion.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-clone)

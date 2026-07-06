# Metodi muokkaa structia. Mikä receiver on oikea: `self`, `&self` vai `&mut self`?

## Taustaa

Rustissa metodit määritellään **`impl`-lohkossa** ja ne saavat aina ensimmäisenä parametrina **receiverin** — viittauksen struct-instanssiin, jota metodi käyttää. Kolme vaihtoehtoa ovat **`self`**, **`&self`** ja **`&mut self`**.

Receiver liittyy suoraan Rustin omistus- ja lainausjärjestelmään. Se kertoo, saako metodi kuluttaa arvon (siirtää omistuksen), lukea sen vai muokata sitä. Kääntäjä valvoo näitä sääntöjä — et voi kutsua `&mut self` -metodia samasta instanssista, jos joku muu pitää jo immuuttista lainaa.

Metodien receiver-valinta on osa API-suunnittelua. Oikea valinta tekee koodista sekä turvallista että ilmaisevaa: lukija näkee metodin allekirjoituksesta, mitä instanssille tapahtuu kutsun jälkeen.

## Tilanne

Rakennat **`Counter`**-structia, jossa on sisäinen laskuri. Tarvitset kaksi metodia: yhden, joka kasvattaa arvoa, ja toisen, joka lukee sen:

```rust
struct Counter {
    n: u32,
}

impl Counter {
    fn inc(???) { self.n += 1; }      // muokkaa tilaa
    fn read(???) -> u32 { self.n }    // vain lukee
}
```

Metodi, joka kasvattaa `n`:ää, **muuttaa** structin sisältöä — se tarvitsee muuttuvan lainauksen. Metodi, joka vain palauttaa arvon, tarvitsee vain lukuoikeuden. Väärä receiver johtaa kääntäjävirheeseen tai turhaan omistuksen siirtoon.

## Ratkaisu

Valitse receiver muutoksen mukaan:

```rust
impl Counter {
    fn inc(&mut self) {
        self.n += 1;
    }

    fn read(&self) -> u32 {
        self.n
    }
}

let mut c = Counter { n: 0 };
c.inc();                  // vaatii mut c
println!("{}", c.read()); // &self — c on edelleen käytettävissä
```

**`&mut self`** tarkoittaa muuttuvaa lainaa: metodi saa muokata kenttiä, mutta omistaja säilyy. **`&self`** tarkoittaa jaettua lukuoikeutta: metodi ei saa muuttaa mitään (ellei sisäisesti käytä `RefCell`-tyyppisiä rakenteita).

**`self`** (ilman `&`-merkkiä) **kuluttaa** instanssin — sen jälkeen et voi kutsua muita metodeja samasta arvosta:

```rust
impl Counter {
    fn into_inner(self) -> u32 {
        self.n  // self siirtyy tähän; c ei ole enää käytettävissä
    }
}
```

## Käytännössä

Useimmat metodit käyttävät **`&self`** (luku) tai **`&mut self`** (muutos). **`self`** on harvinaisempi — sopii kun metodi purkaa arvon osiin tai muuntaa sen toiseen tyyppiin (`into_*`-metodit).

Jos metodi ei tarvitse instanssia ollenkaan, se on **`fn new() -> Self`** tai muu **assosioitu funktio** ilman `self`-parametria. Assosioitu funktio ei ole metodi samassa mielessä, mutta se elää samassa `impl`-lohkossa.

Muista: **`&mut self` vaatii `mut`-muuttujan** — `let mut counter = Counter { n: 0 };`. Ilman `mut`-avainsanaa et voi kutsua muuttavia metodeja, vaikka structin kentät olisivat muuttuvia.

[Lue lisää](https://doc.rust-lang.org/book/ch05-03-method-syntax.html)

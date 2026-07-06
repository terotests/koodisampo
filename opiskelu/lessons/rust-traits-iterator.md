# Mikä trait mahdollistaa `for item in collection` -silmukan?

## Taustaa

Rustin `for`-silmukka ei ole erillinen kokoelmatyyppi — se on syntaktista sokeria **iterator-protokollalle**. Jokainen iterointi kutsuu `next()`-metodia, kunnes iterator palauttaa `None`. Tämä malli on laiska: elementtejä lasketaan vasta kun niitä tarvitaan.

Kokoelmat tarjoavat iteroinnin **`IntoIterator`-traitin** kautta. Trait määrittää, minkä iterator-tyypin syntyy, kun kokoelma kulutetaan `for`-silmukassa. Ymmärtämällä traitit erotat `iter()`, `iter_mut()` ja `into_iter()` -kutsujen merkityksen.

## Tilanne

Rakennat oman listarakenteen `MyList` etkä voi kirjoittaa `for item in &my_list` — kääntäjä valittaa, ettei tyyppi toteuta iterointia:

```rust
struct MyList {
    items: Vec<i32>,
}

// for x in &my_list { ... }  // VIRHE: `MyList` is not an iterator
```

Haluat saman käyttökokemuksen kuin `Vec`:llä: for-silmukka, adapterit (`map`, `filter`) ja `collect`.

## Ratkaisu

Toteuta `IntoIterator` (tai suoraan `Iterator` erilliselle cursor-tyypille):

```rust
struct MyList {
    items: Vec<i32>,
}

struct MyListIter {
    index: usize,
    items: Vec<i32>,
}

impl Iterator for MyListIter {
    type Item = i32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.index < self.items.len() {
            let v = self.items[self.index];
            self.index += 1;
            Some(v)
        } else {
            None
        }
    }
}

impl IntoIterator for MyList {
    type Item = i32;
    type IntoIter = MyListIter;

    fn into_iter(self) -> Self::IntoIter {
        MyListIter { index: 0, items: self.items }
    }
}
```

Käytännössä `Vec` ja muut std-kokoelmat tekevät tämän puolestasi — oma impl tarvitaan custom-rakenteisiin.

## Käytännössä

Kolme lainaustapaa: `.iter()` → `&T`, `.iter_mut()` → `&mut T`, `.into_iter()` kuluttaa kokoelman. For-silmukka `for x in collection` kutsuu automaattisesti `into_iter()`.

Iterator-adaptterit (`map`, `filter`, `take`, `enumerate`) ketjutetaan ja suoritetaan vasta terminointimetodilla (`collect`, `sum`, `for`). Tämä on tehokas tapa käsitellä dataa ilman välikokoelmia — opettele `Iterator`-trait ennen raskaita indeksisilmukoita.

[Lue lisää](https://doc.rust-lang.org/book/ch13-02-iterators.html)

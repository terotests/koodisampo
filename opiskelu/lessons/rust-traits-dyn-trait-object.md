# Tarvitset heterogeenisen vektorin eri tyypeistä samalla traitilla. Mikä tyyppi?

## Taustaa

Joskus kokoelma sisältää **eri konkreettisia tyyppejä**, joilla on yhteinen käyttäytyminen — esimerkiksi piirrettävät muodot tai eri maksutapojen käsittelijät. Geneerinen `Vec<T>` vaatii yhden konkreettisen `T`:n; heterogeeniseen listaan tarvitaan **trait object**.

`dyn Trait` tarkoittaa "mikä tahansa tyyppi, joka toteuttaa traitin", tallennettuna osoittimen ja vtable-tiedon kautta. Se on Rustin tapa tehdä **dynaaminen polymorfia** ajonaikaisesti.

## Tilanne

Rakennat UI:n, joka piirtää listan muotoja. `Circle` ja `Rect` ovat eri structeja, mutta molemmilla on `draw()`:

```rust
trait Drawable {
    fn draw(&self);
}

struct Circle { r: f64 }
struct Rect { w: u32, h: u32 }

impl Drawable for Circle { fn draw(&self) { /* ... */ } }
impl Drawable for Rect { fn draw(&self) { /* ... */ } }

// Vec<Circle> ei voi sisältää Rectejä — tarvitaan yhteinen trait object -tyyppi
```

Haluat yhden vektorin, jota voit iteroida ja kutsua `draw()` ilman erillistä matchia tyypin mukaan.

## Ratkaisu

Käytä `Box<dyn Trait>` (tai `&dyn Trait`) heterogeenisessä kokoelmassa:

```rust
let shapes: Vec<Box<dyn Drawable>> = vec![
    Box::new(Circle { r: 1.0 }),
    Box::new(Rect { w: 2, h: 3 }),
];

for shape in &shapes {
    shape.draw();
}
```

`Box` omistaa objektin heapissa; vektori sisältää yhtenäisiä trait object -osoittimia. Vaihtoehtoisesti `Vec<&dyn Drawable>` toimii, jos elinajat on hallittu muualla.

## Käytännössä

`dyn Trait` vaatii **object safety**: trait-metodit eivät saa palauttaa `Self`-tyyppiä eikä olla geneerisiä tavalla, joka rikkoo vtable-mallia. Staattiseen polymorfiaan (`impl Trait` parametreissa) ei tule heap-allokaatiota eikä vtable-indirektiota — se on nopeampi, mutta ei salli eri tyyppejä samassa vektorissa.

Valitse `Vec<Box<dyn Trait>>`, kun ajonaikainen heterogeenisyys on pakko. Valitse geneerinen koodi tai enum, kun tyypit ovat rajattu joukko ja suorituskyky tärkeää.

[Lue lisää](https://doc.rust-lang.org/book/ch17-02-trait-objects.html)

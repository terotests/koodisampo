# Mikä Rustin trait vastaa käytännössä Java-interfacen roolia?

## Taustaa

Monissa kielissä eri luokat toteuttavat saman rajapinnan (`interface`) ja koodi voi käsitellä niitä yhtenäisesti. Rustissa vastaava rakenne on **trait**: nimetty joukko metodeja, joita tyyppi voi toteuttaa `impl Trait for Type` -syntaksilla.

Trait ei ole perintä kuten Java-luokissa — se on erillinen sopimus. Sama struct voi toteuttaa useita traitteja, ja traitteja voi toteuttaa tyypeille, joita et itse omista (orphan rule rajoittaa yhdistelmiä). Trait on tapa sanoa: "tämä tyyppi osaa tehdä nämä asiat".

## Tilanne

Sovelluksessa on `Article` ja `Tweet` — molemmilla pitäisi olla `summary()`-metodi lyhyen esikatselun tuottamiseen. Ilman traitia kopioit saman metodirakenteen structeihin tai kirjoitat geneeristä koodia, joka ei käänny:

```rust
struct Article { title: String, body: String }
struct Tweet { author: String, content: String }

// Ilman traitia: kaksi erillistä impl:ia, ei yhteistä notify-funktiota
```

Haluat yhden `notify`-funktion, joka hyväksyy kummankin tyypin, kunhan sillä on `summarize`.

## Ratkaisu

Määrittele trait ja toteuta se molemmille tyypeille:

```rust
trait Summary {
    fn summarize(&self) -> String;
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}: {}", self.title, &self.body[..50.min(self.body.len())])
    }
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.author, self.content)
    }
}

fn notify(item: &impl Summary) {
    println!("Uutta: {}", item.summarize());
}
```

`impl Summary` parametri on **trait bound** lyhyessä muodossa — funktio toimii minkä tahansa `Summary`-toteutuksen kanssa.

## Käytännössä

Trait vastaa Java-interfacen roolia käyttäytymisen jakamisessa, mutta Rustissa traitit voivat sisältää oletustoteutuksia ja liittyä geneeriseen koodiin (`where T: Summary`). Staattiseen polymorfiaan käytetään `impl Trait`; ajonaikaisiin heterogeenisiin kokoelmiin `dyn Trait`.

Kun lisäät uuden tyypin, toteutat traitin kerran — olemassa oleva `notify` ja muut geneeriset funktiot toimivat heti ilman muutoksia. Tämä on Rustin tapa kirjoittaa laajennettavaa kirjastokoodia.

[Lue lisää](https://doc.rust-lang.org/book/ch10-02-traits.html)

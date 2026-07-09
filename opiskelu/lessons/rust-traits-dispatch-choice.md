# Valitset `impl Trait`, geneerisen parametrin ja `Box<dyn Trait>` välillä. Miten päätät?

## Taustaa

Rust tarjoaa useita tapoja polymorfiaan. Valinta vaikuttaa kääntöaikaan, suorituskykyyn, binäärikokoon ja siihen, voiko eri tyyppejä olla samassa kokoelmassa. "Mikä syntaksi tähän?" on väärä kysymys — oikea on "mikä dispatch-malli sopii tähän rajapintaan?"

## Tilanne

Rakennat plugin-rajapintaa. Ensin käytät `Box<dyn Handler>` kaikkialla. Myöhemmin huomaat, että yksi hot path voisi olla staattisesti monomorfisoitu — mutta refaktorointi on kallista, koska dispatch-päätös tehtiin syntaksin mukaan, ei suunnittelun.

```rust
// Toimii, mutta aina dynaaminen dispatch + heap-allokaatio
fn run(handler: Box<dyn Handler>) { handler.handle(); }
```

## Ratkaisu

Päätöspuu:

- **`impl Trait` parametrissa**: helppo syntaksi, kun haluat hyväksyä minkä tahansa toteuttajan yhdessä funktiossa (staattinen dispatch, monomorfointi)
- **geneerinen `T: Trait`**: kun sama tyyppi pitää sitoa useaan paikkaan tai struct-kenttään
- **`impl Trait` paluuarvona**: yksi konkreettinen paluutyyppi, piilotettu kutsujalta (ei dynaamista dispatchiä)
- **`Box<dyn Trait>`**: eri konkreettisia tyyppejä runtime-päätöksellä samassa kokoelmassa (heterogeeninen vektori)

```rust
// Staattinen — nopea, kääntöaikainen monomorfointi
fn process(h: impl Handler) { h.handle(); }

// Heterogeeninen lista — dynaaminen dispatch
let handlers: Vec<Box<dyn Handler>> = vec![
    Box::new(EmailHandler),
    Box::new(WebhookHandler),
];
```

## Käytännössä

`dyn Trait` vaatii **object safety** — ei geneerisiä metodeja eikä `Self`-paluuta, joka rikkoisi vtable-mallin. Jos trait ei ole object safe, käytä enumia rajoitetusta tyypistä tai geneerisyyttä.

Aloita `impl Trait` / geneerisyydestä. Siirry `Box<dyn Trait>`:iin vain kun heterogeenisyys on pakko. Profiloi ennen kuin optimoit dispatch-valintaa — monomorfointi voi kasvattaa binääriä.

[Lue lisää](https://doc.rust-lang.org/book/ch17-02-trait-objects.html)

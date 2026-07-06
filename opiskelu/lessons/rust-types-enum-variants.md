# Mikä enum-malli mallintaa HTTP-vastauksen statuskoodin ja bodyn yhdessä tyypissä?

## Taustaa

**Enum** (luettelo) on tyyppi, jolla voi olla useita **variantteja**. Jokainen variantti voi kantaa omia tietojaan — pelkkä tunniste tai esimerkiksi merkkijono tai luku. Enum yhdistää "mikä tapaus on kyseessä" ja "mitä dataa siihen liittyy" yhdeksi arvoksi.

Tämä poikkeaa structista, jossa kaikilla kentillä on arvo samaan aikaan. Enumissa vain **yksi** variantti on aktiivinen kerrallaan. Rustin `Option` ja `Result` ovat itse asiassa standardeja enumeja — ne eivät ole erikoistapauksia, vaan sama perusidea sovellettuna yleisiin ongelmiin.

Enumit tekevät virheellisistä tiloista käännöksellisesti mahdottomia. Et voi vahingossa asettaa `has_error = true` mutta unohtaa virhekoodin, jos virhe on mallinnettu omana varianttinaan.

## Tilanne

Rakennat HTTP-asiakas-kirjastoa. API palauttaa joko onnistuneen vastauksen (body-teksti) tai virheen (statuskoodi). Luonnollinen mutta riskialtis malli käyttää erillisiä kenttiä:

```rust
struct ApiResponse {
    body: Option<String>,
    error_code: Option<u16>,
    has_error: bool,
}
```

Tällainen rakenne sallii ristiriitaisia tiloja: `has_error = false` mutta `error_code = Some(500)`, tai molemmat `body` ja `error_code` asetettuina. Kääntäjä ei huomaa ongelmaa — virheet ilmenevät vasta ajonaikaisesti.

Tarvitset tyypin, joka sallii vain **joko** onnistumisen **tai** virheen, ei molempia eikä epämääräistä "tyhjää" tilaa.

## Ratkaisu

Määrittele **enum**, jossa jokainen mahdollinen tapaus on oma varianttinsa:

```rust
enum ApiResponse {
    Success(String),   // body onnistuneessa vastauksessa
    Error(u16),        // HTTP-status virheessä
}

fn handle(response: ApiResponse) {
    match response {
        ApiResponse::Success(body) => {
            println!("Data: {}", body);
        }
        ApiResponse::Error(code) => {
            eprintln!("HTTP-virhe: {}", code);
        }
    }
}
```

Variantti **`Success(String)`** kantaa body-tekstin, ja **`Error(u16)`** kantaa statuskoodin. Koska vain yksi variantti on aktiivinen, ristiriitaiset tilat eivät ole mahdollisia — tyyppijärjestelmä sulkee ne pois.

`match`-lause pakottaa käsittelemään **molemmat** variantit. Jos lisäät myöhemmin uuden variantin (esim. `Redirect(u16)`), kääntäjä listaa kaikki paikat, joissa `match` pitää päivittää.

## Käytännössä

**`Option<T>`** ja **`Result<T, E>`** ovat standardikirjaston enumeja samalla periaatteella: `Some`/`None` ja `Ok`/`Err`. Niitä käytetään niin usein, ettei tarvitse määritellä omia vastaavia tyyppejä.

Omissa projekteissa domain-virheet mallinnetaan usein omalla enumilla:

```rust
enum AppError {
    NotFound,
    Unauthorized,
    Database(String),
}
```

Tämä tekee virheenkäsittelystä luettavaa: `match`-lauseessa näet kaikki mahdolliset virheet yhdessä paikassa. **`thiserror`-crate** auttaa toteuttamaan `Display`- ja `From`-traitit enum-virheille ilman pitkää toistoa.

[Lue lisää](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)

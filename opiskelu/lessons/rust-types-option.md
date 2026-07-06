# Funktio voi palauttaa arvon tai ei mitään. Mikä tyyppi korvaa null-pointerin?

## Taustaa

Monissa kielissä "ei arvoa" esitetään `null`-osoittimella tai `None`-vakiolla. Ongelma on, että kääntäjä ei pakota tarkistamaan, onko arvo olemassa — ohjelma voi kaatua ajonaikaisesti, kun yrität käyttää puuttuvaa dataa.

Rustissa ei ole null-osoitinta ollenkaan. Sen sijaan standardikirjasto tarjoaa **`Option<T>`**-enumin, joka kertoo tyyppijärjestelmän kautta: funktio palauttaa joko arvon (`Some(T)`) tai sen, ettei arvoa ole (`None`). Kääntäjä vaatii sinua käsittelemään molemmat tapaukset ennen kuin pääset käsiksi varsinaiseen arvoon.

`Option<T>` on yksi Rustin perustyypeistä. Se on samaan aikaan turvallinen ja tehokas: muistissa se on yleensä yhtä suuri kuin itse `T` plus yksi tavu, joka kertoo onko arvo mukana.

## Tilanne

Haet käyttäjää tietokannasta ID:llä. Tulos voi olla löytynyt tai ei:

```rust
fn find_user(id: u64) -> ??? {
    if id == 0 { /* ei löydy */ }
    else { /* palauta User */ }
}
```

C-kielessä palautettaisiin `NULL` ja toivottaisiin, että kutsuja muistaa tarkistaa osoitin ennen käyttöä. Java ja C# käyttäisivät `null`-viitettä, joka aiheuttaa `NullPointerException`-tyyppisiä virheitä, jos tarkistus unohtuu.

Rustissa `???` korvataan **`Option<User>`**-tyypillä. Funktion allekirjoitus kertoo jo lukijalle: "tämä voi epäonnistua — älä oleta, että käyttäjä löytyy aina". Tämä on tarkoituksellinen suunnittelupäätös, ei vain syntaksiero.

## Ratkaisu

**`Option<T>`** on enum, jolla on kaksi varianttia: `Some(T)` kun arvo on olemassa, ja `None` kun sitä ei ole:

```rust
struct User {
    id: u64,
    name: String,
}

fn find_user(id: u64) -> Option<User> {
    if id == 0 {
        None
    } else {
        Some(User {
            id,
            name: "Maija".into(),
        })
    }
}

match find_user(42) {
    Some(user) => println!("Löytyi: {}", user.name),
    None => println!("Ei löytynyt"),
}
```

`match`-lause purkaa `Option`-arvon turvallisesti. Kääntäjä pakottaa käsittelemään sekä `Some`- että `None`-haaran — et voi "unohtaa" null-tarkistusta, koska Rustissa nullia ei ole.

Jos yrität käyttää arvoa suoraan ilman tarkistusta, koodi ei edes käänny. Tämä siirtää virheet käännösaikaan ajonaikaisen kaatumisen sijaan.

## Käytännössä

Lyhyissä ketjuissa **`if let Some(x) = ...`** on siistimpi kuin täysi `match`, kun välität vain `None`-haaran. Metodiketjut kuten `.map()`, `.filter()` ja `.unwrap_or(oletus)` tekevät muunnoksista luettavia.

Tuotantokoodissa vältä **`.unwrap()`** ilman hyvää perustetta — se panikoi `None`-haarassa ja kaataa koko prosessin. Parempi on palauttaa virhe kutsujalle, logata tilanne tai tarjota järkevä oletusarvo `.unwrap_or()`-metodilla.

Kun funktio palauttaa `Option<T>`, dokumentoi selkeästi milloin `None` tarkoittaa "ei löytynyt", "ei oikeuksia" tai "tyhjä lista". Sama `None` voi tarkoittaa eri asioita eri funktioissa, joten nimeäminen ja kommentit auttavat lukijaa.

[Lue lisää](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)

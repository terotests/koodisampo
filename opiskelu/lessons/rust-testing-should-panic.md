# Testaat että funktio panikoi virheellisellä syötteellä. Mikä attribuutti?

## Taustaa

Rustissa virheet käsitellään tyypillisesti `Result`-tyypillä — virheellinen syöte palauttaa `Err`-arvon. Joissain tilanteissa funktio **panikoi** (`panic!`) invariantin rikkoessa: ohjelmoijan virhe, ei odotettu käyttäjäsyöte. Testeissä on tärkeää varmistaa, että funktio todella panikoi odotetulla syötteellä — ei palauta hiljaa väärää tulosta.

Testauskehyksen `#[should_panic]`-attribuutti kertoo testirunnerille: tämän testin odotetaan **epäonnistuvan paniikilla**. Jos funktio ei panikoi, testi failaa. Jos funktio palauttaa normaalisti, testi failaa. Attribuutti on yksinkertaisin tapa testata paniikki-käyttäytymistä.

## Tilanne

Funktio `parse_port` muuntaa merkkijonon porttinumeroksi. Arvot alle 1 tai yli 65535 ovat ohjelmoijan virhe — funktio panikoi selkeällä viestillä. Testissä haluat varmistaa, että `"99999"` aiheuttaa paniikin, ei esimerkiksi kiertävää arvoa 99999 % 65536.

```rust
fn parse_port(s: &str) -> u16 {
    let n: u32 = s.parse().expect("invalid port string");
    if n == 0 || n > 65535 {
        panic!("invalid port: {n}");
    }
    n as u16
}
```

## Ratkaisu

Merkitse testi `#[should_panic]`-attribuutilla:

```rust
#[test]
#[should_panic(expected = "invalid port")]
fn rejects_port_out_of_range() {
    parse_port("99999");
}

#[test]
#[should_panic]
fn rejects_zero_port() {
    parse_port("0");
}
```

`expected = "invalid port"` tarkistaa, että panic-viesti **sisältää** annetun merkkijonon — löyhempi kuin täsmällinen match. Ilman `expected`-parametria mikä tahansa paniikki kelpaa.

Onnistunut testi: funktio panikoi → testi **passaa**. Epäonnistuminen: funktio palauttaa arvon → testi **failaa** ("test did not panic").

## Käytännössä

**Result-pohjaisessa API:ssa** preferoi `assert!(parse_port("99999").is_err())` paniikin sijaan — paniikki on tuotantokoodissa harvinaisempi valinta käyttäjäsyötteelle. `#[should_panic]` sopii invarianteille ja sisäisille asserteille.

Hienovaraisempaan testaukseen (sivuvaikutukset, useita paniikkeja): `std::panic::catch_unwind`. Doc-testeissä: `/// ```should_panic`. Vältä liian löysää `#[should_panic]` ilman `expected`-kenttää — se voi peittää vääriä paniikkeita.

[Lue lisää](https://doc.rust-lang.org/book/ch11-01-writing-tests.html#checking-for-panics-with-should-panic)

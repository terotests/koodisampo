# Funktio ottaa `String`-parametrin arvona. Mitä tapahtuu kutsukohdassa?

## Taustaa

Rust on järjestelmäohjelmointikieli, joka yhdistää C/C++:n suorituskyvyn moderniin muistiturvallisuuteen. Kielen ydin on **omistajuusmalli** (ownership): jokaisella arvolla on yksi omistaja kerrallaan, ja kääntäjä seuraa omistajuuden siirtoa käännösaikana. Tämä korvaa roskienkeruun ja manuaalisen `free()`-hallinnan useimmissa tilanteissa.

Jos tulet Java- tai Python-maailmasta, olet tottunut siihen, että muuttujat viittaavat objekteihin ja voit antaa saman arvon usealle funktiolle ilman erityistä ajattelua. Rustissa arvo itsessään — ei viite siihen — siirtyy funktiolle, ellei erikseen lainata tai kopioida. Tämä tuntuu aluksi rajoittavalta, mutta se eliminoi suuren osan muistivirheistä jo ennen ohjelman ajamista.

## Tilanne

Kirjoitat funktion, joka ottaa merkkijonon parametrina arvona (ei viitteenä):

```rust
fn process(data: String) {
    println!("{}", data);
}

fn main() {
    let msg = String::from("Hei");
    process(msg);
    // println!("{}", msg);  // KÄÄNTÄJÄVIRHE: value moved
}
```

Kehittäjä, joka tulee Java- tai Python-maailmasta, odottaa `msg`:n olevan käytettävissä kutsun jälkeen. Rustissa näin ei ole: `process(msg)` **siirtää** merkkijonon omistajuuden funktiolle. Kun `process` päättyy, merkkijono tuhoutuu automaattisesti (`Drop`), koska funktio omisti sen.

Vertaa C++:n `std::move`-semantiikkaan: siirto on halpa — heap-puskuria ei kopioida, vaan omistajuus vaihtuu. Ero on, että Rustissa siirto on **oletus**, ei valinnainen optimointi. Kääntäjä estää käyttämästä `msg`:ää sen jälkeen, kun omistajuus on luovutettu.

## Ratkaisu

Funktioparametri `String` **siirtää omistajuuden** (move) funktioon. Alkuperäinen muuttuja invalidoituu — se ei ole enää voimassa. Move on Rustin oletus; kopio tapahtuu vain eksplisiittisesti (`.clone()`).

```rust
fn process(data: String) {
    // data omistaa heap-puskurin täällä
    println!("{}", data);
}  // data dropataan — muisti vapautuu

let msg = String::from("Hei");
process(msg);        // move — omistajuus siirtyy process-funktioon
// msg ei enää kelpaa: compile error "value used after move"

let msg2 = String::from("Hei");
process(msg2.clone());  // eksplisiittinen syvä kopio — msg2 kelpaa yhä
println!("{}", msg2);   // OK
```

Siirron jälkeen alkuperäinen muuttuja on tyhjä paikka kääntäjän silmissä — sitä ei voi lukea, kirjoittaa tai siirtää uudelleen. Tämä on tarkoituksellista: se varmistaa, ettei kahta omistajaa yritä vapauttaa samaa heap-muistia (`double free`) tai että viittaus ei jää roikkumaan jo vapautettuun dataan.

Jos funktion ei tarvitse **omistaa** dataa vaan vain lukea sitä, oikea ratkaisu on lainaus (`&str`), ei siirto. Siirto on oikea valinta, kun funktio ottaa vastuun elinkaaresta — esimerkiksi tallentaa arvon vektoriin, lähettää sen kanavaan tai siirtää eteenpäin toiselle omistajalle.

## Käytännössä

API-suunnittelussa valitse parametrien omistajuus tarkoituksella. `fn read(path: &str)` kun riittää lukea; `fn consume(path: String)` kun funktio omistaa tiedoston polun tai muuttaa sen. Siirto vähentää turhia `.clone()`-kutsuja ja tekee elinkaaren näkyväksi koodissa.

Kun kääntäjä valittaa `value moved`, kysy itseltäsi: tarvitseeko funktio omistaa datan? Jos ei, vaihda `String` → `&str` tai `Vec<T>` → `&[T]`. Jos kyllä, hyväksy move ja älä yritä käyttää muuttujaa uudelleen — tai kloonaa tarkoituksella ennen kutsua.

Move koskee kaikkia omistettavia tyyppejä: `String`, `Vec`, `HashMap`, omat structit joilla on heap-data. `Copy`-traitin toteuttavat pienet tyypit (`i32`, `bool`, `char`) kopioituvat sen sijaan automaattisesti — siitä erillinen oppitunti.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)

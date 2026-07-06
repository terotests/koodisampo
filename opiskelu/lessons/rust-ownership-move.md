# Funktio ottaa `String`-parametrin arvona. Mitä tapahtuu kutsukohdassa?

## Taustaa

Rust on järjestelmäohjelmointikieli, joka yhdistää C/C++:n suorituskyvyn moderniin muistiturvallisuuteen. Kielen ydin on **omistajuusmalli** (ownership): jokaisella arvolla on yksi omistaja kerrallaan, ja kääntäjä seuraa omistajuuden siirtoa käännösaikana. Tämä korvaa roskienkeruun ja manuaalisen `free()`-hallinnan useimmissa tilanteissa.

## Tilanne

Kirjoitat funktion, joka ottaa merkkijonon:

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

Kehittäjä, joka tulee Java- tai Python-maailmasta, odottaa `msg`:n olevan käytettävissä kutsun jälkeen. Rustissa näin ei ole.

## Ratkaisu

Funktioparametri `String` **siirtää omistajuuden** (move) funktioon. Alkuperäinen muuttuja invalidoituu — se ei ole enää voimassa. Move on Rustin oletus; kopio tapahtuu vain eksplisiittisesti (`.clone()`).

```rust
fn process(data: String) { /* omistaa datan */ }

let msg = String::from("Hei");
process(msg);        // move — omistajuus siirtyy
// msg ei enää kelpaa

let msg2 = String::from("Hei");
process(msg2.clone());  // eksplisiittinen kopio — msg2 kelpaa yhä
```

## Käytännössä

Jos funktion ei tarvitse omistaa dataa, käytä lainausta: `fn process(data: &str)`. Move on oikea valinta, kun funktio ottaa vastuun elinkaaresta — esimerkiksi lisää arvon vektoriin tai siirtää sen eteenpäin.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)

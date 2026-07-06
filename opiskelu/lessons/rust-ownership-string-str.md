# Funktio ottaa merkkijonon parametriksi mutta ei tarvitse omistaa sitä. Mikä tyyppi on idiomaattisin?

## Taustaa

Rustissa on kaksi pääasiallista merkkijonotyyppiä: **`String`** (omistettu, muuttuva, heap-puskuri) ja **`&str`** (lainattu merkkijonon pätkä — "string slice"). Tämä jako vastaa karkeasti C++:n `std::string` vs `string_view`, tai Pythonin `str`-objektia vs sen sisäistä puskuria — mutta Rust tekee eron tyyppeihin kääntäjätasolla.

Java-kehittäjälle: `String` on kuin Java `String`, mutta omistettu ja siirrettävä. `&str` on kuin metodi, joka ottaa `CharSequence`-rajapinnan — se hyväksyy monenlaisia lähteitä ilman omistajuuden luovutusta.

## Tilanne

Kirjoitat API:n, joka vain lukee nimen tervehdykseen. Parametri on `String`:

```rust
fn greet(name: String) {
    println!("Hei, {}!", name);
}

// Kutsukohdissa pakotetaan turhia allokaatioita:
greet("Maija".to_string());           // allokoi heap
greet(String::from("Maija"));         // allokoi heap
greet(existing_string.clone());       // kloonaa tarpeettomasti
```

Funktio ei tarvitse omistaa merkkijonoa — se ei tallenna sitä, ei muokkaa sitä, ei siirrä eteenpäin. Omistettu `String`-parametri pakottaa kutsujan luovuttamaan omistajuuden tai kloonaamaan. Tämä on hidasta ja kömpelöä API:lle, joka vain lukee tekstiä.

## Ratkaisu

**`&str`** on idiomaattisin parametri, kun funktio vain lukee merkkijonoa:

```rust
fn greet(name: &str) {
    println!("Hei, {}!", name);
}

greet("Maija");                    // string literal — tyyppi &str
greet(&owned_string);              // &String → &str (Deref-coercion)
greet(&another_string[2..5]);      // osa merkkijonosta — slice
```

`&str` on lainaus jostain merkkijonosta: se voi viitata string literaaliin (`.rodata`-segmentti), `String`-puskuriin, tiedoston puskuriin tai mihin tahansa UTF-8-tavujonoon. Funktio ei omista dataa — lainaus päättyy kun parametri poistuu scopesta, mutta omistaja (`String` tai literal) elää normaalisti.

Kun funktion **täytyy** omistaa tai palauttaa merkkijono, käytä `String`:

```rust
fn normalize(input: &str) -> String {
    input.trim().to_lowercase()  // uusi omistettu merkkijono
}
```

## Käytännössä

API-suunnittelusääntö: **parametreissa `&str`, paluuarvoissa `String`** kun luot uutta tekstiä. Poikkeus: omistajuuden siirto (`fn take(s: String)`) kun funktio kuluttaa merkkijonon.

`&String` parametri on lähes aina huono valinta verrattuna `&str`:ään — se rajoittaa kutsuja (ei literal-suoraa kutsua ilman ylimääräistä `&`) eikä tarjoa etua. Sama logiikka koskee `&Vec<T>` vs `&[T]` erillisessä oppitunnissa.

Deref-coercion: kun annat `&String` funktiolle joka odottaa `&str`, Rust muuntaa automaattisesti. Sinun ei tarvitse kirjoittaa `name.as_str()` — `&owned` riittää. Tämä tekee `&str`-parametreista joustavia ilman boilerplatea.

[Lue lisää](https://doc.rust-lang.org/book/ch04-03-slices.html)

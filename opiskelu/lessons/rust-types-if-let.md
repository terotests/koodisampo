# `Option`-arvo pitää purkaa vain onnistuneessa tapauksessa ilman turhaa match-haaraa `None`:lle. Mikä pattern syntax on idiomaattisin?

## Taustaa

`Option<T>`- ja `Result<T, E>`-arvot puretaan yleensä **`match`**-lauseella, joka käsittelee kaikki variantit. Tämä on turvallista ja selkeää, mutta joskus tarvitset vain yhden haaran — esimerkiksi "jos käyttäjä löytyi, lähetä sähköposti" — ja haluat ohittaa `None`-tilanteen hiljaisesti.

Rust tarjoaa tähän **`if let`**-syntaksin. Se yhdistää `if`-ehdon ja pattern matchingin: jos arvo vastaa annettua kuviota, haara suoritetaan ja kuvioon sidotut muuttujat ovat käytettävissä. Muussa tapauksessa haara ohitetaan kokonaan.

`if let` ei korvaa `match`-lauseen turvallisuutta monimutkaisissa tapauksissa, mutta se tekee yksittäisten haarojen käsittelystä lyhyttä ja luettavaa. Se on erityisen yleinen `Option`- ja `Result`-ketjuissa.

## Tilanne

Sinulla on funktio, joka palauttaa `Option<User>`, ja haluat toimia vain kun käyttäjä löytyy:

```rust
fn find_user(id: u64) -> Option<User> { /* ... */ }

// Täysi match tuntuu turhalta verbosilta:
match find_user(id) {
    Some(user) => send_email(&user),
    None => {}  // ei tehdä mitään
}
```

Tässä `None`-haara on tyhjä — ainoa kiinnostava tapaus on `Some`. Täysi `match` toimii, mutta se lisää kolme riviä siihen, mikä on oikeastaan yksinkertainen ehto.

Sama tilanne toistuu usein: valinnainen konfiguraatio, yksittäinen listan alkio, yksi onnistunut `Result`-haara. Kaikissa `if let` on luonteva valinta.

## Ratkaisu

**`if let Some(user) = find_user(id)`** sitoo `user`-muuttujan vain kun arvo on `Some`:

```rust
if let Some(user) = find_user(id) {
    send_email(&user);
}
// None-haara: ei tehdä mitään (tai lisää else-lohko)
```

Jos haluat käsitellä myös `None`-haaran, lisää **`else`**:

```rust
if let Some(user) = find_user(id) {
    send_email(&user);
} else {
    log::warn!("Käyttäjää {} ei löytynyt", id);
}
```

**`while let`** toimii samalla periaatteella silmukassa — sopii erityisen hyvin iteratorien kulutukseen:

```rust
while let Some(line) = lines.next() {
    process(line);
}
// Silmukka päättyy kun iterator palauttaa None
```

## Käytännössä

Käytä **`if let`**, kun kiinnostaa yksi variantti ja muut voidaan ohittaa tai käsitellä `else`-haarassa. Käytä **`match`**, kun tarvitset kaikki variantit tai monimutkaisempia kuvioita (esim. useita kenttiä structista).

`if let` toimii myös **`Result`-arvoille**:

```rust
if let Ok(config) = load_config("app.toml") {
    apply(config);
}
```

Muista, että `if let Ok(...)` **ei käsittele** `Err`-haaraa — virhe jää huomiotta, jos et lisää `else`-haaraa. Tuotantokoodissa virheellinen `Result` kannattaa usein propagooida `?`-operaattorilla tai käsitellä eksplisiittisesti.

[Lue lisää](https://doc.rust-lang.org/book/ch18-01-all-the-places-for-patterns.html)

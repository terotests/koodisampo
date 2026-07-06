# Luot uuden struct-instanssin kopioimalla vanhan mutta vaihdat yhden kentän. Mikä syntaksi?

## Taustaa

Struct on tyyppi, jossa useita nimettyjä kenttiä yhdessä paketissa — esimerkiksi `User { name, email, age }`. Uuden instanssin luominen vaatii yleensä arvon jokaiselle kentälle. Jos suurin osa kentistä pysyy samana ja muutat vain yhden, toistaminen on työlästä ja virhealtista.

Rust tarjoaa **struct update syntax** -syntaksin: **`..vanha`** kopioi kaikki kentät, joita et erikseen mainitse. Se muistuttaa JavaScriptin spread-operaattoria, mutta toimii Rustin omistussääntöjen mukaan — joissakin tapauksissa vanha instanssi **siirtyy** (move) uuteen.

Tämä on käytännöllinen päivityksissä, testidatan luonnissa ja tilan kopioinnissa, jossa muutat vain yhden kentän.

## Tilanne

Sinulla on olemassa oleva käyttäjä API-kutsun jälkeen, ja haluat päivittää vain sähköpostiosoitteen:

```rust
struct User {
    name: String,
    email: String,
    active: bool,
}

let user = User {
    name: "Maija".into(),
    email: "mai@example.com".into(),
    active: true,
};

// Tarvitset kopion, jossa vain email on eri
```

Manuaalinen kopio kirjoittaa kaikki kentät uudelleen — helppo virhe, jos jokin kenttä jää vahingossa vanhaan arvoon tai uuteen eri arvoon kuin tarkoitit.

## Ratkaisu

**Struct update syntax** luo uuden instanssin mainitsemistasi kentistä ja kopioi loput vanhasta:

```rust
let updated = User {
    email: "new@example.com".into(),
    ..user
};
```

Tässä `email` tulee uudesta arvosta. `name` ja `active` kopioidaan **`user`**:stä `..user`-syntaksilla. `updated` on itsenäinen instanssi — muutat vain sitä, jos se on `mut`.

**Tärkeä huomio omistuksesta:** `..user` **siirtää** (move) ne kentät, joita et erikseen määritä, jos ne eivät toteuta **`Copy`**-traitia. `String` ei ole `Copy`, joten **`user` ei ole enää käytettävissä** `updated`-luonnin jälkeen:

```rust
// println!("{}", user.name);  // VIRHE: user on moveattu
println!("{}", updated.email); // ok
```

Jos kentät ovat `Copy`-tyyppejä (esim. `u32`, `bool`), vanha instanssi voi olla edelleen käytettävissä.

## Käytännössä

Jos tarvitset **sekä vanhan että uuden** instanssin samanaikaisesti, kloonaa ensin:

```rust
let updated = User {
    email: "new@example.com".into(),
    ..user.clone()
};
// user on edelleen käytettävissä
```

Vaihtoehtoisesti muokkaa olemassa olevaa instanssia suoraan, jos et tarvitse kopiota:

```rust
user.email = "new@example.com".into();
```

Struct update sopii erityisen hyvin tilanteisiin, joissa luot "melkein saman" arvon — testifixturet, konfiguraatiopäivitykset ja tilakoneiden seuraavat tilat. Muista aina tarkistaa, tarvitsetko `clone()`:n ennen `..`-syntaksia.

[Lue lisää](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#creating-instances-from-other-instances-with-struct-update-syntax)

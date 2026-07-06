# Haluat lukea vektoria funktiossa ilman omistajuuden luovutusta. Mikä parametri?

## Taustaa

Omistajuuden siirto (move) on Rustin oletus, mutta suurin osa funktioista **lukee** dataa muokkaamatta sitä. Java- ja Python-maailmassa välität listan viitteen — objekti pysyy kutsujan hallussa. Rustissa vastaava on **lainaus** (borrowing): `&T` antaa tilapäisen luku-oikeuden omistamatta dataa.

Lainaus ei hidasta ohjelmaa: se on osoitin stackissa, ei syvää kopiota. Ero moveen: omistaja (`team` vektori) pysyy voimassa kutsun jälkeen, ja funktio ei voi vapauttaa tai siirtää dataa pois.

## Tilanne

Sinulla on `Vec<User>` ja haluat laskea aktiiviset käyttäjät funktiossa ilman kopiointia tai omistajuuden luovutusta:

```rust
struct User { name: String, active: bool }

fn count_active(users: ???) -> usize {
    users.iter().filter(|u| u.active).count()
}

let team = vec![
    User { name: "Maija".into(), active: true },
    User { name: "Pekka".into(), active: false },
];
count_active(team);
// team pitää olla käytettävissä tämän jälkeen
```

Jos parametri on `Vec<User>`, move veisi omistajuuden — `team` invalidoituu. Jos käytät `.clone()`, saat kopion mutta maksat allokaatiosta turhaan suurelle datalle. Tarvitset lainauksen.

## Ratkaisu

**Jaettu lainaus** `&T` antaa luku-oikeuden omistajaa siirtämättä. Useita `&T`-lainauksia samaan dataan voi olla samanaikaisesti — kaikki vain lukevat:

```rust
fn count_active(users: &[User]) -> usize {
    users.iter().filter(|u| u.active).count()
}

let team = vec![User { name: "Maija".into(), active: true }];
let n = count_active(&team);  // lainaa — team kelpaa yhä
println!("{} aktiivista, {} jäljellä", n, team.len());
```

`&[User]` on **slice** — lainaus vektorin (tai taulukon) jatkumosta. Se hyväksyy `&vec` ja `&array` ilman erillistä konversiota. `&Vec<User>` toimii myös, mutta slice on idiomaattisempi (ks. erillinen oppitunti).

Funktio ei saa muokata dataa `&[User]`-parametrin kautta — vain lukea. Jos tarvitset muokkausta, tarvitset `&mut Vec<User>` tai `&mut [User]` (erillinen oppitunti muokkaavasta lainauksesta).

## Käytännössä

API-suunnittelussa suosi slicea `&[T]` vektorin sijaan: se hyväksyy sekä `Vec` että kiinteän taulukon lainauksen. Sama logiikka merkkijonoissa: `&str` parametri, ei `&String`.

Lainaus on oletusarvo, kun funktio vain lukee dataa. Move (`Vec<User>`) kun funktio kuluttaa vektorin — esim. `fn sort_in_place(mut v: Vec<T>)`. Clone kun tarvitset oikeasti erillisen kopion.

Muista kutsukohdassa `&`: `count_active(team)` ei käänny — tarvitset `count_active(&team)`. Kääntäjä auttaa: "expected reference `&[User]` found `Vec<User>`". Tämä `&`-merkintä kutsukohdassa luo lainauksen — eri asia kuin C++:n osoittimen osoittaminen, mutta käytännössä samankaltainen ajatus.

[Lue lisää](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

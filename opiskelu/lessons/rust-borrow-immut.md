# Haluat lukea vektoria funktiossa ilman omistajuuden luovutusta. Mikä parametri?

## Tilanne

Sinulla on `Vec<User>` ja haluat laskea käyttäjiä funktiossa ilman kopiointia tai omistajuuden luovutusta:

```rust
fn count_active(users: ???) -> usize {
    users.iter().filter(|u| u.active).count()
}

let team = vec![User { name: "Maija".into(), active: true }];
count_active(team);
// team pitää olla käytettävissä tämän jälkeen
```

Move (`Vec<User>`) veisi omistajuuden. Kopio (`.clone()`) on turhaa suurelle datalle.

## Ratkaisu

**Jaettu lainaus** `&Vec<T>` (tai paremmin `&[T]`) antaa luku-oikeuden omistajaa siirtämättä:

```rust
fn count_active(users: &[User]) -> usize {
    users.iter().filter(|u| u.active).count()
}

let team = vec![User { /* ... */ }];
let n = count_active(&team);  // lainaa — team kelpaa yhä
```

Useita `&T`-lainauksia samaan dataan voi olla samanaikaisesti — kaikki vain lukevat.

## Käytännössä

API-suunnittelussa suosi slicea `&[T]` vektorin sijaan: se hyväksyy sekä `Vec` että taulukon lainauksen. Lainaus on oletusarvo, kun funktio vain lukee dataa.

[Lue lisää](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

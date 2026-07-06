# Funktio voi palauttaa arvon tai ei mitään. Mikä tyyppi korvaa null-pointerin?

## Tilanne

Haet käyttäjää tietokannasta ID:llä. Tulos voi olla löytynyt tai ei:

```rust
fn find_user(id: u64) -> ??? {
    if id == 0 { /* ei löydy */ }
    else { /* palauta User */ }
}
```

C-kielessä palautettaisiin `NULL`. Java/C# käyttäisi `null`. Rustissa null-osoitinta ei ole.

## Ratkaisu

**`Option<T>`** on enum, jolla kaksi varianttia: `Some(T)` tai `None`:

```rust
fn find_user(id: u64) -> Option<User> {
    if id == 0 {
        None
    } else {
        Some(User { id, name: "Maija".into() })
    }
}

match find_user(42) {
    Some(user) => println!("{}", user.name),
    None => println!("Ei löytynyt"),
}
```

Kääntäjä pakottaa käsittelemään molemmat haarat — ei voi "unohtaa" null-tarkistusta.

## Käytännössä

Lyhyissä ketjuissa `if let Some(x) = ...` tai `.map()` / `.unwrap_or()` ovat käteviä. Tuotantokoodissa vältä `.unwrap()` ilman perustetta — se panikoi `None`-haarassa.

[Lue lisää](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)

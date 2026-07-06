# Funktio palauttaa `Option<T>` mutta kutsuja tarvitsee `Result<T, MyError>`. Mikä metodi auttaa?

## Taustaa

**`Option<T>`** kertoo "arvo on" tai "arvoa ei ole" — se ei kerro *miksi* arvo puuttuu. **`Result<T, E>`** puolestaan erottaa onnistumisen (`Ok`) ja virheen (`Err`), jossa virhe voi olla mielivaltainen tyyppi: HTTP 404, tietokantavirhe, validointiviesti.

Usein sisäinen kerros palauttaa **`Option`** (yksinkertainen haku), mutta rajapinta (REST-handler, CLI) tarvitsee **`Result`**, jotta virhe voidaan raportoida kutsujalle selkeästi. Rust tarjoaa suoran muunnoksen **`Option` → `Result`** -metodeilla.

Toinen suunta on myös yleinen: **`Result::ok()`** muuntaa `Result` → `Option` ja heittää virheen pois. Valitse suunta sen mukaan, haluatko säilyttää virhetiedon vai pelkän "onko arvoa" -tiedon.

## Tilanne

Tietokantakerros palauttaa valinnaisen käyttäjän:

```rust
fn find_user(id: u64) -> Option<User> {
    // None jos ei löydy
}
```

HTTP-handler tarvitsee kuitenkin palauttaa **`Result<User, AppError>`**, jotta reitti voi vastata 404:llä tai 500:lla:

```rust
enum AppError {
    NotFound,
    Internal(String),
}

fn get_user_handler(id: u64) -> Result<User, AppError> {
    let user = find_user(id);  // Option<User> — miten saada Result?
    // ...
}
```

Pelkkä `None` ei riitä: asiakas haluaa erottaa "ei löytynyt" muista virheistä. Tarvitset eksplisiittisen muunnoksen `None` → `Err(...)`.

## Ratkaisu

**`.ok_or(virhe)`** muuntaa `Some(v)` → `Ok(v)` ja `None` → `Err(virhe)`:

```rust
fn get_user_handler(id: u64) -> Result<User, AppError> {
    find_user(id).ok_or(AppError::NotFound)
}
```

Jos virheen luominen on kallista tai tarvitsee runtime-tietoa, käytä **`ok_or_else`**, joka ottaa sulkeuman:

```rust
find_user(id).ok_or_else(|| AppError::Internal(format!("id {} puuttuu", id)))
```

`ok_or` evaluoi virheen aina; `ok_or_else` luo virheen vain `None`-haarassa — sama ero kuin `unwrap_or` vs. `unwrap_or_else`.

Käänteinen muunnos **`Result` → `Option`**:

```rust
let maybe: Option<User> = fetch_user(id).ok();  // Err → None, Ok → Some
```

## Käytännössä

Ketjuta muunnoksia metodiketjuissa:

```rust
find_user(id)
    .ok_or(AppError::NotFound)?
    .validate()
    .map_err(AppError::Validation)?;
```

**`.and_then()`** ja **`.map()`** toimivat sekä `Option`- että `Result`-tyypeillä — ne auttavat välttämään sisäkkäisiä `match`-lauseita. Valitse `Option` sisäiseen logiikkaan ja muunna `Result`-rajapintaan vasta reunalla (handler, public API).

Muista: **`ok_or` heittää pois syyn**, miksi arvo puuttui. Jos `None` tarkoittaa useita eri asioita, harkitse suoraan `Result`-paluutyyppiä jo sisäisessä funktiossa.

[Lue lisää](https://doc.rust-lang.org/std/option/enum.Option.html#method.ok_or)

# Haluat newtype-wrapperin `UserId(u64)` estämään sekoittamasta tavalliseen u64:ään. Miten?

## Taustaa

Rustissa **`u64`** on 64-bittinen etumerkitön kokonaisluku. Se on kätevä tunnisteiden tallentamiseen, mutta kaikki `u64`-arvot ovat tyypillisesti keskenään vaihdettavissa — kääntäjä ei erota "käyttäjän ID:tä" "tilauksen ID:stä".

**Newtype pattern** (uusi tyyppi vanhan päällä) ratkaisee tämän määrittelemällä oman struct-tyypin, joka käärii yhden kentän. Rustissa tähän käytetään usein **tuple structia**: struct ilman nimettyjä kenttiä, jossa arvot ovat suluissa.

Tuple struct on "zero-cost abstraction": ajonaikaisesti se on yleensä saman kokoinen kuin sisäinen tyyppi, eikä siihen liity ylimääräistä suorituskykykustannusta. Kääntäjä estää kuitenkin vahingossa sekoittamasta eri merkityksellisiä tunnisteita.

## Tilanne

Sinulla on kaksi funktiota, jotka molemmat ottavat `u64`-parametrin:

```rust
fn get_user(id: u64) -> User { /* ... */ }
fn get_order(id: u64) -> Order { /* ... */ }

let user_id: u64 = 42;
let order_id: u64 = 1001;

get_user(order_id);  // kääntyy — mutta logiikka on väärä!
```

Kääntäjä hyväksyy kutsun, koska molemmat argumentit ovat `u64`-tyyppiä. Virhe paljastuu vasta tuotannossa, kun väärästä tunnisteesta haetaan väärä tietue. Tämä on klassinen "primitive obsession" -ongelma.

Haluat tehdä virheellisen kutsun **käännösvirheeksi**, ei hiljaiseksi logiikkabugiksi.

## Ratkaisu

Määrittele **tuple struct** jokaiselle tunnistetyypille:

```rust
struct UserId(u64);
struct OrderId(u64);

fn get_user(id: UserId) -> User { /* ... */ }
fn get_order(id: OrderId) -> Order { /* ... */ }

let user_id = UserId(42);
let order_id = OrderId(1001);

get_user(user_id);    // ok
// get_user(order_id); // VIRHE: expected UserId, found OrderId
```

Sisältö on edelleen `u64`, mutta tyyppijärjestelmä erottaa **`UserId`** ja **`OrderId`**. Konversio vaatii eksplisiittisen koodin — esimerkiksi **`From<u64>`**-traitin tai konstruktorifunktion.

Kenttään pääsy tapahtuu tuple structissa pistesyntaksilla:

```rust
let id = UserId(42);
println!("{}", id.0);  // 42 — sisäinen u64
```

## Käytännössä

Toteuta tarvittaessa **`Debug`**, **`Display`** ja **`From`** -traitit, jotta tunnisteet tulostuvat luettavasti ja muunnetaan helposti:

```rust
#[derive(Debug)]
struct UserId(u64);

impl From<u64> for UserId {
    fn from(n: u64) -> Self {
        UserId(n)
    }
}

let id = UserId::from(42);
```

Newtype toimii myös **`String`**:n tai muiden tyyppien ympärillä — esimerkiksi `Email(String)` erottaa sähköpostiosoitteen tavallisesta merkkijonosta. Sama periaate: yksi kääritty arvo, oma tyyppi, kääntäjän tarkistus.

[Lue lisää](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#using-tuple-structs-without-named-fields-to-create-different-types)

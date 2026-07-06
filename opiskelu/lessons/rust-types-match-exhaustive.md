# Miksi `match` enum-arvolla vaatii kaikki variantit käsiteltäväksi?

## Taustaa

Rustin **`match`**-lause on pattern matching -työkalu: se vertaa arvoa kuvioihin ja suorittaa ensimmäisen sopivan haaran. Enum-arvojen kanssa jokainen variantti on oma kuvionsa — `Some(x)`, `None`, `Ok(v)`, `Err(e)` ja niin edelleen.

Toisin kuin monissa kielissä `switch`-lause, joka voi "putoaa läpi" seuraavaan haaraan, Rustin `match` on **pakollinen lauseke**: sen täytyy palauttaa arvo (tai `()`), ja se on **ekshaustiivinen** eli kattava. Kääntäjä varmistaa, että mikään mahdollinen arvo ei jää käsittelemättä.

Tämä on tarkoituksellinen turvallisuusominaisuus. Kun lisäät enumiin uuden variantin, kääntäjä pakottaa päivittämään kaikki `match`-lauseet — et voi unohtaa uutta tapausta vahingossa.

## Tilanne

Sinulla on viestien käsittelyyn tarkoitettu enum:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}
```

Käsittelet viestejä `match`-lauseella. Myöhemmin tiimi lisää uuden variantin **`Message::Resize { w: u32, h: u32 }`**, mutta unohtaa päivittää yhden vanhan `match`-lohkon.

C-kielen `switch`-lauseessa uusi `case` saattaisi jäädä huomaamatta — ohjelma toimii osittain, mutta uusi viestityyppi ohitetaan hiljaisesti. Rustissa kääntäjä pysäyttää buildin heti.

## Ratkaisu

Kääntäjä raportoi virheen: **`non-exhaustive patterns`** — eli kaikkia variantteja ei ole käsitelty. Korjaus on lisätä puuttuva haara:

```rust
match msg {
    Message::Quit => quit(),
    Message::Move { x, y } => move_player(x, y),
    Message::Write(text) => write(text),
    Message::Resize { w, h } => resize(w, h),  // uusi haara
}
```

Wildcard **`_`** kattaa kaikki jäljellä olevat variantit, mutta sitä kannattaa käyttää vain tietoisesti — esimerkiksi kun olet varma, ettei uusia variantteja tule, tai kun haluat tietoisesti ohittaa loput:

```rust
match opt {
    Some(v) => use_value(v),
    None => default_action(),
}
// Kaikki Option-variantit käsitelty — ei tarvita _
```

Jos käytät `_` enumiin, johon voi tulla uusia variantteja, menetät kääntäjän suojan. Tämä on joskus ok (esim. testikoodissa), mutta tuotantokoodissa eksplisiittiset haarat ovat turvallisempia.

## Käytännössä

Valitse työkalu tilanteen mukaan: **`if let`** yhteen haaraan, kun muut voidaan ohittaa; **`match`** kaikkiin haaroihin tai monimutkaisiin kuvioihin.

Kun refaktoroit enumia, anna kääntäjän ohjata: korjaa jokainen `non-exhaustive patterns` -virhe ennen mergeä. CI ja `cargo check` toimivat turvaverkkona — yksikin unohtunut `match` estää buildin.

Joskus näet **`match`-lauseen ilman `_`-wildcardia struct-kentissä**, jossa kaikki kentät sidotaan erikseen. Sama ekshaustiivisuusperiaate pätee: kääntäjä varmistaa, ettei mitään jää huomaamatta.

[Lue lisää](https://doc.rust-lang.org/book/ch06-02-match.html)

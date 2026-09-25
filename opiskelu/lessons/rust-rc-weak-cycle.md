# Puurakenteessa lapsi pitää `Rc`-viitteen vanhempaansa ja vanhempi `Rc`-viitteet lapsiinsa. Puu ei vapaudu koskaan. Miksi ja mikä korjaa?

## Tilanne

Puurakenne, jossa jokainen solmu tuntee lapsensa ja vanhempansa:

```rust
struct Node {
    value: i32,
    parent: RefCell<Option<Rc<Node>>>,
    children: RefCell<Vec<Rc<Node>>>,
}
```

Muistiprofiloija näyttää, ettei yksikään puu vapaudu, vaikka viimeinenkin muuttuja poistuu näkyvistä.

## Ratkaisu

Tee takaisinviittauksesta **heikko**:

```rust
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

// lapsen liitos:
*child.parent.borrow_mut() = Rc::downgrade(&parent);

// vanhemman luku:
if let Some(p) = child.parent.borrow().upgrade() { /* ... */ }
```

## Taustaa

`Rc` vapauttaa arvon, kun **vahvojen** viitteiden määrä laskee nollaan. Kun vanhempi omistaa lapsen ja lapsi vanhemman, kumpikin pitää toista elossa, eikä kumpikaan laskuri koskaan saavuta nollaa. Rust estää muistivirheet, mutta ei viitekehistä johtuvia vuotoja.

`Weak` ei kasvata vahvaa laskuria. Omistus kulkee vain vanhemmasta lapseen, ja lapsi saa vanhemman käyttöönsä `upgrade()`-kutsulla, joka palauttaa `None`, jos vanhempi on jo vapautettu. `Arc` on sama asia säieturvallisena, eikä sekään pura kehiä.

[Lue lisää](https://doc.rust-lang.org/book/ch15-06-reference-cycles.html)

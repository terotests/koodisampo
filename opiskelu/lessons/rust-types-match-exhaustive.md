# Miksi `match` enum-arvolla vaatii kaikki variantit käsiteltäväksi?

## Tilanne

Lisäät enum-variantin `Message::Quit` mutta unohdat päivittää match-lausekkeen.

## Ratkaisu

Kääntäjä raportoi: `non-exhaustive patterns`. Lisää haara tai `_` tietoisesti vain jos kaikki variantit käsitelty muualla.

## Käytännössä

`if let` yhteen haaraan; `match` moniin. `_` wildcard vain kun olet varma kaikista tapauksista.

[Lue lisää](https://doc.rust-lang.org/book/ch06-02-match.html)

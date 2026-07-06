# Miksi `let r = &vec[0]; vec.push(1);` voi olla kääntäjävirhe?

## Tilanne

Pidät viittauksen vektorin elementtiin ja lisäät samalla uusia elementtejä — klassinen roikkuva viittaus.

## Ratkaisu

Borrow checker kieltää samanaikaisen elementtiviittauksen ja `&mut vec` (push vaatii). Ratkaisu: rajaa viittauksen scope, käytä indeksiä, tai kloonaa tarvittava arvo ennen pushia.

## Käytännössä

Sama sääntö koskee `String`-merkkijonon merkkiviittauksia ja `.push_str()`:ää.

[Lue lisää](https://doc.rust-lang.org/book/ch08-02-strings.html#indexing-into-strings)

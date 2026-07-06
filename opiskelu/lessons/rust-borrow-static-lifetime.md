# Mikä `'static` lifetime tarkoittaa Rustissa?

## Tilanne

API vaatii `T: 'static` — mitä se tarkoittaa geneeriselle tyypille vs viittaukselle?

## Ratkaisu

`&'static str` elää ikuisesti (literal). `T: 'static` tarkoittaa: T ei sisällä lainattuja viittauksia lyhyempään elinaikaan — voi olla owned String, i32, jne.

## Käytännössä

Thread spawn vaatii usein `F: 'static` — closure ei saa lainata stack-muuttujia spawnin jälkeen.

[Lue lisää](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#the-static-lifetime)

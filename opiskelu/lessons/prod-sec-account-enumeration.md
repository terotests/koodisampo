# Login palauttaa 'User not found' mutta väärällä salasanalla 'Invalid password'. Mikä riski?

## Tilanne

"User not found" vs "Invalid password" — eri virheilmoitukset.

## Riski

**Account enumeration** — hyökkääjä selvittää rekisteröityjä käyttäjiä.

## Miksi tämä on vaarallista

Enumeration auttaa kohdistetussa hyökkäyksessä ja salasanan reset -spämmissä. Pelkkä tekstin yhtenäistäminen ei aina riitä.

## Väärä korjaus

"Palauta HTTP 404 vain olemattomille käyttäjille" — statuskoodi paljastaa saman tiedon kuin eri viesti.

"Captcha login-sivulla estää enumerationin täysin" — auttaa brute forcea vastaan, ei poista eri virheilmoituksia.

## Parempi korjaus

Käytä samaa ulkoista virheilmoitusta: "Sähköposti tai salasana on virheellinen."

Pidä myös HTTP-status, vastausaika ja reset-flow mahdollisimman samanlaisina. Muuten käyttäjän olemassaolo voi vuotaa vaikka teksti olisi sama.

Sisäiseen audit-lokiin voi kirjata tarkemman syyn.

## Tuotantohuomiot

Testaa myös password reset -flow: älä paljasta, onko sähköposti rekisteröity, ellei tuote sitä tarkoituksella vaadi.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

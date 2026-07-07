# Login palauttaa 'User not found' mutta väärällä salasanalla 'Invalid password'. Mikä riski?

## Tilanne

"User not found" vs "Invalid password" — eri virheilmoitukset.

## Ratkaisu

**Account enumeration** — hyökkääjä selvittää rekisteröityjä käyttäjiä.

Käytä samaa ulkoista virheilmoitusta: "Sähköposti tai salasana on virheellinen." Sisäiseen audit-lokiin voi kirjata tarkemman syyn.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

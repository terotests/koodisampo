# API kopioi pyynnön Origin-headerin sellaisenaan Access-Control-Allow-Origin-arvoksi ja palauttaa Access-Control-Allow-Credentials: true. Mikä ongelma?

## Tilanne

Palvelin kopioi pyynnön `Origin`-headerin vastaukseen `Access-Control-Allow-Origin`-arvoksi ja lisää `Access-Control-Allow-Credentials: true`. Usein näin "korjataan" tilanne, jossa selain hylkäsi yhdistelmän `*` + credentials.

## Ratkaisu

CORS ei ole palvelinpuolen authorization-mekanismi — se on selaimen käytäntö.

- Heijastettu Origin + credentials antaa minkä tahansa sivuston lukea kirjautuneen käyttäjän vastaukset
- Selain hylkää yhdistelmän `*` + credentials, mutta Originin heijastus ohittaa tämän suojan
- Salli vain tunnetut originit
- Tee varsinainen authz aina palvelimella

**Estääkö CORS curl-pyynnön?** Ei — CORS on selainrajoite.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

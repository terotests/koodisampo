# GET /download?file=report.pdf — backend: sendFile('/var/app/files/' + req.query.file). Hyökkääjä antaa ../../../../etc/passwd. Mikä riski?

## Tilanne

```http
GET /download?file=report.pdf
```

`sendFile("/var/app/files/" + req.query.file)` — hyökkääjä: `../../../../etc/passwd`

## Riski

**Path traversal** — käyttäjä kiertää sallitun hakemistorajan.

## Miksi tämä on vaarallista

`../` kiertää hakemistorajan. URL-encoding ei riitä — backend voi dekoodata polut ennen tarkistusta.

## Väärä korjaus

"URL-encoding riittää — %2e%2e estää pisteet" — dekoodaus tapahtuu usein ennen tarkistusta.

"Symlink attack vaatii root-oikeudet" — symlink sallitussa hakemistossa voi osoittaa ulos, vaikka normalisointi näyttäisi turvalliselta.

Luota pelkkään `startsWith`-tarkistukseen ilman tiedosto-ID-mallia — reunatapauksia voi jäädä, ja symlinkit voivat ohittaa rajauksen.

## Parempi korjaus

**Ensisijainen ratkaisu:** älä anna käyttäjän valita raakaa polkua. Käytä tiedosto-ID:tä ja hae sallittu polku tietokannasta.

Jos polkua täytyy käsitellä:

```ts
const base = path.resolve("/var/app/files");
const target = path.resolve(base, userInput);
if (!target.startsWith(base + path.sep)) throw new Error("invalid path");
```

Huomioi myös symlinkit: normalisointi ei yksin riitä, jos sallitussa hakemistossa oleva symlink osoittaa sen ulkopuolelle.

## Tuotantohuomiot

Tallenna tiedostot käyttäjän valitsemien nimien ulkopuolella. Palvelu ei saa suorittaa ladattuja tiedostoja suoraan polun perusteella.

[Lue lisää](https://owasp.org/www-community/attacks/Path_Traversal)

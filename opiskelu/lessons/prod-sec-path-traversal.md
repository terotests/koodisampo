# GET /download?file=report.pdf — backend: sendFile('/var/app/files/' + req.query.file). Hyökkääjä antaa ../../../../etc/passwd. Mikä riski?

## Tilanne

```http
GET /download?file=report.pdf
```

`sendFile("/var/app/files/" + req.query.file)` — hyökkääjä: `../../../../etc/passwd`

## Ratkaisu

**Path traversal.**

- Älä anna käyttäjän valita raakaa polkua
- Käytä tiedosto-ID:tä ja hae polku tietokannasta
- Normalisoi polku ja varmista että se pysyy sallitun hakemiston sisällä

```ts
const base = path.resolve("/var/app/files");
const target = path.resolve(base, userInput);
if (!target.startsWith(base + path.sep)) throw new Error("invalid path");
```

[Lue lisää](https://owasp.org/www-community/attacks/Path_Traversal)

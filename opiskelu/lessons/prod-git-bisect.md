# Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin?

## Tilanne

Versio 1.0 toimi. Nykyinen `main` on rikki — testi X epäonnistuu. 200 committia välissä. Manuaalinen `git checkout` jokaiselle versiolle vie päiviä. Tarvitaan systemaattinen tapa rajata syyllinen revision puoleen väliin.

## Ratkaisu

`git bisect` — binäärihaku hyvän ja huonon revision välillä:

```bash
git bisect start
git bisect bad                 # nykyinen HEAD on rikki
git bisect good v1.0.0         # viimeinen tunnettu toimiva tag

# Git checkoutaa keskikohdan — aja testi:
npm test
git bisect good   # jos testi läpi
git bisect bad    # jos testi fail

# toista kunnes:
# abc1234 is the first bad commit
git bisect reset
```

Jokainen askel puolittaa hakuvälin — 200 committia → ~8 testikierrosta.

## Automatisointi

```bash
git bisect run npm test
```

Git ajaa testin automaattisesti jokaiselle välirevisiolle. `bisect run` vaatii deterministisen exit coden (0 = good, 1–127 = bad).

[Lue lisää](https://git-scm.com/docs/git-bisect)

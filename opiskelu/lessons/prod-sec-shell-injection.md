# Sovellus ajaa `os.system("convert " + user_filename)` ilman validointia. Hyökkääjä syöttää `file.png; rm -rf /`. Mikä korjaus?

## Tilanne

Kuvamuunnos käyttää shell-komentoa:

```python
os.system("convert " + user_filename)
```

Hyökkääjä syöttää: `file.png; rm -rf /`

## Riski

Command injection / shell injection. Kun käyttäjän syöte liitetään shell-komentoon merkkijonona, hyökkääjä voi lisätä shell-metamerkkejä kuten `;`, `&&`, `|`, `$()`, backtickit tai uudelleenohjauksia.

## Miksi tämä on vaarallista

Shell tulkitsee metamerkit — yksi upload voi ajaa mielivaltaisia komentoja palvelimen oikeuksilla. Ongelma ei rajoitu puolipisteisiin: putket, subshellit ja uudelleenohjaukset toimivat samalla tavalla.

## Väärä korjaus

"Escapaa lainausmerkit riittää" — shell-metamerkit eivät rajoitu lainausmerkkeihin, ja escapetus on helppo tehdä väärin.

"Base64-koodaa filename ennen shell-komentoa" — ei poista shellin käyttöä; dekoodaus ja interpolointi voi silti olla haavoittuva.

"Aja root-oikeuksin vain luotettaville käyttäjille" — vähentää hyökkäyspintaa, mutta ei korjaa injektiota.

## Parempi korjaus

**Älä rakenna shell-komentoa stringinä.** Käytä argumenttilistaa ilman shelliä:

```python
import subprocess

subprocess.run(
    ["convert", input_path, output_path],
    check=True,
    shell=False,
    timeout=10,
)
```

Lisäksi:

- älä käytä käyttäjän antamaa tiedostonimeä suoraan polkuna
- validoi tiedosto aiemmin upload-vaiheessa
- käytä väliaikaista sisäistä tiedostonimeä
- rajoita ajonaika, muistinkäyttö ja tiedostokoko
- aja käsittely vähäoikeuksisena käyttäjänä tai sandboxissa
- käytä mieluummin kirjastoa kuin shell-komentoa

## Tuotantohuomiot

Pelkkä escapetus ei ole paras opetus eikä paras ratkaisu. Oikea pääviesti: älä interpoloi käyttäjän syötettä shell-komentoon. Jos shell on pakollinen, käytä eksplisiittistä argumenttirakennetta ja rajaa käyttäjän syöte sallittuun formaattiin.

[Lue lisää](https://owasp.org/www-community/attacks/Command_Injection)

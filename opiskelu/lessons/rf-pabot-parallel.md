# Robot-testit kestävät 45 minuuttia. Voiko ne ajata rinnakkain turvallisesti?

## Tilanne

Regressiopaketti kestää 45 minuuttia. CI-putken budjetti on 15 minuuttia. Tiimi haluaa ajaa testit rinnakkain Pabotilla tai useilla CI-jobilla — mutta testit jakavat saman käyttäjän, saman tilauksen ja saman selainportin.

## Ratkaisu

**Kyllä Pabotilla tai CI:n rinnakkaisilla jobeilla — mutta vain jos testit ovat eristettyjä (data, sessio, portit).**

```bash
pabot --processes 4 tests/
```

Rinnakkaistus vaatii:

- testit eivät jaa samaa käyttäjää/sessiota
- testit eivät muokkaa samaa tilausta/tenanttia
- testidata on uniikkia
- portit, tiedostopolut ja selaimet eivät törmää
- raportit yhdistetään oikein (`rebot`)

## Käytännössä

Älä korjaa hidasta ja epäluotettavaa testisettiä vain lisäämällä rinnakkaisuutta. Ensin varmista testien eristys ja datan hallinta — muuten rinnakkaisuus pahentaa flakya. Tagit (`smoke`, `regression`) auttavat jakamaan ajoja, mutta eivät korvaa eristystä.

[Lue lisää](https://pabot.org/)

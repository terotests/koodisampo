# Milloin React Native olisi silti perusteltu peliprojektissa?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo Rangerissa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kun koko tuote on jo RN-sovellus ja peli on pieni osa (esim. quiz-näkymä)

RN sopii upotettuun quiz-/lomakenäkymään olemassaosaan RN-appiin.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Aina kun tarvitaan isometrinen kartta; Kun pelilogiikka on yli 5000 riviä custom DSL:ssä. Koodisampo on pääosin peli — RN ei ole sen ydin.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://reactnative.dev/docs/getting-started)

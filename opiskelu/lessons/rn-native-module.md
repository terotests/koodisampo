# Jos RN:ää käytetään silti, missä pelilogiikan pitäisi ajaa?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo jaetussa simulaatiokerroksessa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Native module (Kotlin/Swift) — JS kutsuu input/snapshot-API:a, ei aja pelisääntöjä

Ohut JS, paksu natiivi — päinvastoin kuin tyypillinen RN-sovellus.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Redux store pelilogiikalla; Hermes-bytecode generoitu custom DSL:stä. Pelisäännöt JS:ssä = kolmas kopio natiivin ja web-version rinnalle.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://reactnative.dev/docs/native-modules-intro)

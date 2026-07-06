# GameController päivittää snapshotin jokaisen näppäimen jälkeen. Mikä state-ratkaisu sopii?

## Tilanne

Flutter tarjoaa yhden UI-koodipohjan mobiilille ja desktopille. Koodisampo-tyyppisessä pelissä Flutter on näkymäkerros: simulaatio pysyy Rangerissa tai natiivissa kirjastossa.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** ChangeNotifier / Riverpod / Bloc — yksi lähde totuudelle, UI kuuntelee

Snapshot on reaktiivinen tila — valitse yksi selkeä pattern.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: setState koko MaterialApp:in juuressa; Global muuttujat ilman notifyListeners. Hajautettu setState skaalaa huonosti moniruutuisessa pelissä.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.flutter.dev/data-and-backend/state-mgmt/intro)

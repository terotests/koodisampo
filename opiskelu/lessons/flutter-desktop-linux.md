# Haluat yhden Flutter-koodipohjan Android + Linux desktop -natiiviin. Onnistuuko?

## Tilanne

Flutter tarjoaa yhden UI-koodipohjan mobiilille ja desktopille. Koodisampo-tyyppisessä pelissä Flutter on näkymäkerros: simulaatio pysyy Rangerissa tai natiivissa kirjastossa.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kyllä — Flutter tukee desktopia (Linux/Windows/macOS) samalla UI-koodilla

Flutter on varteenotettava kun tavoite on yksi UI kaikille alustoille.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Flutter toimii vain mobiilissa; Linux vaatii erillisen GTK-version koodista. Desktop-tuki on virallinen — `flutter run -d linux` toimii.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.flutter.dev/platform-integration/desktop)

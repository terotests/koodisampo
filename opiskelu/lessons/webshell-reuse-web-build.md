# Mikä on web-kuoren suurin etu Koodisampo-arkkitehtuurissa?

## Tilanne

Tauri ja Capacitor paketoivat olemassa olevan web-game-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** web-game/ + koodisampo.cjs + content/ toimivat sellaisenaan — yksi build usealle alustalle

Hosts ovat ohuita — web on jo valmis host; kuori lisää vain jakelukanavan.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Web-kuori ajaa Rangerin nopeammin kuin natiivi; Ei tarvita sync-web-game-assets -skriptiä. Sama CI-build → Tauri/Capacitor/PWA.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://github.com/terotests/koodisampo/tree/main/web-game)

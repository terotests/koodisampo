# Tauri-sovellus lataa paikallisen index.html:n. Turvallisuushuomio?

## Tilanne

Tauri ja Capacitor paketoivat olemassa olevan web-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** CSP + rajoita Tauri allowlist — älä expose turhia shell-komentoja

Tauri capabilities ja CSP estävät XSS:stä shell-pääsyn.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Paikallinen HTML on aina turvallinen ilman CSP:tä; WebView ei voi ajaa JavaScriptiä. Paikallinen ≠ automaattisesti turvallinen jos lataat ulkoista sisältöä.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://tauri.app/security/)

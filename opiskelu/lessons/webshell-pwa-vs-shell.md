# GitHub Pages -PWA vs Capacitor App Store -julkaisu?

## Tilanne

Tauri ja Capacitor paketoivat olemassa olevan web-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** PWA riittää jaettuun linkkiin; kauppa vaatii kuoren tai natiivin

Jos web-peli on jo PWA-yhteensopiva, kuori on valinnainen jakelukanava.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: PWA ja natiiviappi ovat identtisiä kaupan näkökulmasta; PWA ei toimi offline-tilassa koskaan. PWA on helpoin; kauppa on erillinen kanava.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://web.dev/explore/progressive-web-apps)

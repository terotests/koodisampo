# Mikä on web-kuoren suurin etu web-pelin arkkitehtuurissa?

## Tilanne

Tauri ja Capacitor paketoivat olemassa olevan web-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Web-build + assetit toimivat sellaisenaan — yksi build usealle alustalle

Hosts ovat ohuita — web on jo valmis host; kuori lisää vain jakelukanavan.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Web-kuori ajaa pelimoottorin nopeammin kuin natiivi; Staattisia assetteja ei tarvitse koskaan synkronoida buildiin. Sama CI-build → Tauri/Capacitor/PWA.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://tauri.app/reference/webview/)

# Web-build bundlaa JSON-assetit staattiseen hakemistoon. Toimiiko offline kuoressa?

## Tilanne

Tauri ja Capacitor paketoivat olemassa olevan web-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kyllä — staattiset assetit mukana paketissa, fetch paikallisista tiedostoista

Kun assetit kopioidaan buildiin, kuori toimii offline samalla tavoin kuin PWA.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Ei — kuori vaatii aina CDN:n; Vain online-tila tuettu Capacitorissa. Staattinen build on offline-valmis.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://web.dev/learn/pwa/web-app-manifest)

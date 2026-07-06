# content/worlds, question-banks, stories — miksi tämä sopii custom-moottoriin?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Jos pelimoottori on jo custom-simulaatiokirjasto, valinta koskee usein hostia eikä scene-puu-moottoria.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Data on jo JSONissa — pelimoottori lataa ja core tulkitsee; ei editorin lock-inia

Data-driven arkkitehtuuri on vahvuus — moottorivalinta ei muuta sitä.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: JSON toimii vain Unityssä ScriptableObjecteina; Godot ei voi lukea ulkoisia tiedostoja. Unity/Godot voisivat lukea JSONin, mutta logiikka pitäisi silti integroida tai portata.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.godotengine.org/en/stable/classes/class_json.html)

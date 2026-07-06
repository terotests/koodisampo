# Desktop-webkuori tarvitsee käyttäjän valitseman tiedoston lukemisen. Mitä pitää huomioida?

## Tilanne

Tauri ja Capacitor paketoivat web-frontendin natiivimpaan jakeluympäristöön. Hyöty tulee nopeasta jakelusta ja plugin-API:sta, mutta samalla pitää hallita WebViewin turvallisuus, tallennus ja alustakohtaiset oikeudet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Käytä kuoren tiedosto/dialogi-API:a ja rajaa pääsy valittuihin polkuihin

Desktop-kuori voi antaa hallitun tiedostopääsyn, mutta oikeudet pitää rajata.

Webin sandbox estää mielivaltaisen tiedostoluvun. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Anna frontendille rajoittamaton pääsy koko levyyn; Oleta että selain fetch voi lukea minkä tahansa paikallisen tiedoston.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://tauri.app/plugin/file-system/)

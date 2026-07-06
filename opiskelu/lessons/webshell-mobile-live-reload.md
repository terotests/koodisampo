# Capacitor-kehityksessä haluat testata puhelimella paikallista dev-palvelinta. Mikä on tyypillinen malli?

## Tilanne

Tauri ja Capacitor paketoivat web-frontendin natiivimpaan jakeluympäristöön. Hyöty tulee nopeasta jakelusta ja plugin-API:sta, mutta samalla pitää hallita WebViewin turvallisuus, tallennus ja alustakohtaiset oikeudet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Aja dev server --host/--external ja osoita Capacitor server.url lähiverkon osoitteeseen

Live reload nopeuttaa mobiili-WebViewin iterointia.

Android-testaukseen ei tarvita Xcodea. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Asenna Xcode Android-testaukseen; Kopioi build käsin puhelimen Downloads-kansioon joka muutoksella.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://capacitorjs.com/docs/guides/live-reload)

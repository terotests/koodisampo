# WebView-sovellus käyttää IndexedDB:tä. Mikä riski pitää tunnistaa?

## Tilanne

Tauri ja Capacitor paketoivat web-frontendin natiivimpaan jakeluympäristöön. Hyöty tulee nopeasta jakelusta ja plugin-API:sta, mutta samalla pitää hallita WebViewin turvallisuus, tallennus ja alustakohtaiset oikeudet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** WebViewin storage-käytös ja backup/poisto voivat poiketa selaimesta; kriittinen data kannattaa hallita pluginilla

WebView storage on kätevä, mutta natiivivarasto voi olla luotettavampi asetuksille ja salaisuuksille.

IndexedDB ei ole salaisuuksien turvallinen varasto oletuksena. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: IndexedDB ei toimi missään WebViewissä; IndexedDB on aina salattu salaisuuksille.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

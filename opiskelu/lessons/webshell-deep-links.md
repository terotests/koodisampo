# Mobiilikuori avaa sovelluksen linkistä tiettyyn näkymään. Mitä tarvitaan?

## Tilanne

Tauri ja Capacitor paketoivat web-frontendin natiivimpaan jakeluympäristöön. Hyöty tulee nopeasta jakelusta ja plugin-API:sta, mutta samalla pitää hallita WebViewin turvallisuus, tallennus ja alustakohtaiset oikeudet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Universal/App Links -konfiguraatio ja reitin käsittely frontendissä

Deep link vaatii sekä alustakonfiguraation että sovelluksen reittilogiikan.

Responsiivinen CSS ei avaa sovellusta linkistä. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Pelkkä CSS media query; LocalStorageen kirjoitettu viimeisin sivu.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://capacitorjs.com/docs/guides/deep-links)

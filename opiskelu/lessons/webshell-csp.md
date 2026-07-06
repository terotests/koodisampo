# Web-kuoressa ladataan etäistä sisältöä. Mikä suojaus on erityisen tärkeä?

## Tilanne

Tauri ja Capacitor paketoivat web-frontendin natiivimpaan jakeluympäristöön. Hyöty tulee nopeasta jakelusta ja plugin-API:sta, mutta samalla pitää hallita WebViewin turvallisuus, tallennus ja alustakohtaiset oikeudet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Tiukka Content Security Policy ja rajatut natiivikomennot

CSP pienentää XSS-riskiä, joka voisi muuten päästä natiivibridgeen.

Etäsisältö ja natiivioikeudet ovat vaarallinen yhdistelmä ilman rajoja. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Poista HTTPS-vaatimus kehityksen helpottamiseksi; Salli inline-script kaikkialta.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

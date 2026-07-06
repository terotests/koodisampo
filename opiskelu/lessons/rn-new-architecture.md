# Mitä React Native New Architecture tavoittelee?

## Tilanne

React Native yhdistää React-mallin ja natiivikomponentit. Hyvä arkkitehtuuri erottaa komponenttien paikallisen tilan, jaetun sovellustilan sekä natiivimoduulit, joita tarvitaan alustakohtaisiin ominaisuuksiin.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Parempi natiivi-JS integraatio Fabric-rendererillä ja TurboModuleilla

New Architecture modernisoi RN:n renderöintiä ja moduulijärjestelmää.

Se ei muuta RN:ää selainkehykseksi. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: React-komponenttien poistamista kokonaan; CSS-renderöintiä selaimen kautta.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://reactnative.dev/architecture/landing-page)

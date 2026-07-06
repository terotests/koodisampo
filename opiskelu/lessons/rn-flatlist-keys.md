# FlatList renderöi datalistaa, jonka järjestys muuttuu. Mikä on tärkeää?

## Tilanne

React Native yhdistää React-mallin ja natiivikomponentit. Hyvä arkkitehtuuri erottaa komponenttien paikallisen tilan, jaetun sovellustilan sekä natiivimoduulit, joita tarvitaan alustakohtaisiin ominaisuuksiin.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** keyExtractor palauttaa stabiilin yksilöllisen avaimen

Stabiilit keyt auttavat Reactia säilyttämään rivien identiteetin.

Indeksiavaimet aiheuttavat väärää tilan kierrätystä järjestyksen muuttuessa. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Käytä aina array-indeksiä avaimena; Poista kaikki keyt suorituskyvyn vuoksi.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://reactnative.dev/docs/flatlist)

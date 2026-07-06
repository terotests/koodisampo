# Moottori exporttaa usealle alustalle. Mikä pitää silti testata erikseen?

## Tilanne

Unityn, Godotin ja muiden pelimoottorien arvioinnissa tärkeintä on sopivuus käyttötapaukseen. Valmiit scene-, asset-, fysiikka- ja export-työkalut voivat nopeuttaa työtä, mutta ne tuovat myös oman arkkitehtuurinsa ja ylläpitokustannuksensa.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Input, suorituskyky, tiedostopolut, plugin-tuet ja kauppakohtaiset vaatimukset per alusta

Export helpottaa jakelua, mutta alustat eroavat käytännön yksityiskohdissa.

Editorissa toimiminen ei takaa mobiili- tai konsolitoimivuutta. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Vain editorissa Play-nappi riittää kaikille alustoille; Alustakohtaisia eroja ei ole moottorissa.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html)

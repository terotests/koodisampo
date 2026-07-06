# Milloin natiivi sovelluskehys voi olla parempi kuin pelimoottorin UI?

## Tilanne

Unityn, Godotin ja muiden pelimoottorien arvioinnissa tärkeintä on sopivuus käyttötapaukseen. Valmiit scene-, asset-, fysiikka- ja export-työkalut voivat nopeuttaa työtä, mutta ne tuovat myös oman arkkitehtuurinsa ja ylläpitokustannuksensa.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Kun sovellus on pääosin lomakkeita, listoja, tekstinsyöttöä ja alustakohtaisia käyttöliittymäkontrolleja

Natiivi UI antaa usein paremmat tekstikentät, saavutettavuuden ja alustakonventiot.

Pelimoottorin UI on vahva pelin sisäisissä HUD- ja menu-tarpeissa. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Kun tarvitaan particle system; Kun halutaan 3D-valaistus.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://developer.apple.com/design/human-interface-guidelines/)

# Unityssä sama vihollis-/kortti-/paneeliobjekti esiintyy monessa kentässä. Mitä käytät?

## Tilanne

Unityn, Godotin ja muiden pelimoottorien arvioinnissa tärkeintä on sopivuus käyttötapaukseen. Valmiit scene-, asset-, fysiikka- ja export-työkalut voivat nopeuttaa työtä, mutta ne tuovat myös oman arkkitehtuurinsa ja ylläpitokustannuksensa.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Prefabia, jossa jaettu rakenne ja komponentit ovat yhdessä paikassa

Prefab on Unityn keskeinen uudelleenkäytettävän objektin malli.

Kopiot irtoavat toisistaan ja bugikorjaukset unohtuvat helposti. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Kopioi GameObject joka sceneen ilman prefab-yhteyttä; Luo objekti vain screenshotina.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.unity3d.com/Manual/Prefabs.html)

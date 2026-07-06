# Moottoriprojekti käyttää sekä C# / GDScript -skriptejä että natiivilaajennuksia. Mihin raja kannattaa vetää?

## Tilanne

Unityn, Godotin ja muiden pelimoottorien arvioinnissa tärkeintä on sopivuus käyttötapaukseen. Valmiit scene-, asset-, fysiikka- ja export-työkalut voivat nopeuttaa työtä, mutta ne tuovat myös oman arkkitehtuurinsa ja ylläpitokustannuksensa.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Pidä korkean tason pelilogiikka skripteissä ja suorituskykykriittinen tai SDK-integraatio natiivilaajennuksissa

Selkeä vastuuraja pitää kehityksen nopeana ja suorituskyvyn hallittavana.

Turha natiivikerros hidastaa iterointia. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Kirjoita kaikki engineen C++:lla alusta asti; Sekoita sama vastuu sekä skriptiin että natiivipuolelle.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/)

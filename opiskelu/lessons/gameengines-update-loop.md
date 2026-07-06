# Reaaliaikainen moottori tarjoaa Update-loopin. Mitä sinne ei kannata laittaa?

## Tilanne

Unityn, Godotin ja muiden pelimoottorien arvioinnissa tärkeintä on sopivuus käyttötapaukseen. Valmiit scene-, asset-, fysiikka- ja export-työkalut voivat nopeuttaa työtä, mutta ne tuovat myös oman arkkitehtuurinsa ja ylläpitokustannuksensa.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Raskasta IO:ta tai harvoin muuttuvaa liiketoimintalogiikkaa joka framelle

Update ajetaan usein, joten siellä oleva turha työ näkyy heti suorituskyvyssä.

Kaikki logiikka ei kuulu frame loopiin. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Kevyt inputin lukeminen tarpeen mukaan; Animaation aikaperusteinen päivitys.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.unity3d.com/Manual/ExecutionOrder.html)

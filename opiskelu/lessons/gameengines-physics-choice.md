# 2D-sovellus tarvitsee törmäyksiä ja rigid body -liikettä. Miksi moottorin fysiikka voi auttaa?

## Tilanne

Unityn, Godotin ja muiden pelimoottorien arvioinnissa tärkeintä on sopivuus käyttötapaukseen. Valmiit scene-, asset-, fysiikka- ja export-työkalut voivat nopeuttaa työtä, mutta ne tuovat myös oman arkkitehtuurinsa ja ylläpitokustannuksensa.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Valmis collision detection ja solver vähentävät oman fysiikkakoodin tarvetta

Fysiikkamoottori on hyödyllinen, kun simulaatio vastaa sen mallia.

Sitä ei pidä käyttää asioihin, jotka eivät ole fysiikkaa. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Fysiikka korvaa käyttöliittymän saavutettavuuden; Fysiikka tekee tietokantamigraatiot automaattisesti.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.godotengine.org/en/stable/tutorials/physics/physics_introduction.html)

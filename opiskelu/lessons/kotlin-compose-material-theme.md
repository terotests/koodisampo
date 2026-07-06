# Sovellus tarvitsee yhtenäiset värit ja typografian. Mihin Compose-rakenteeseen ne kannattaa keskittää?

## Tilanne

Androidin Kotlin + Jetpack Compose -kehityksessä olennaista on erottaa UI-tila, sovellustila ja alustapalvelut toisistaan. Compose kuvaa näkymän deklaratiivisesti, ViewModel säilyttää näytön tilan ja repositoryt hoitavat datalähteet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** MaterialTheme ja oma theme-wrapper sovelluksen juuressa

Theme tekee UI:sta yhtenäisen ja helpottaa dark mode -tukea.

Kovakoodaus hajottaa ylläpidon ja saavutettavuuden. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Kovakoodaa värit jokaiseen Text-komponenttiin; Lue värit BuildConfigista joka recompositiossa.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://developer.android.com/develop/ui/compose/designsystems/material3)

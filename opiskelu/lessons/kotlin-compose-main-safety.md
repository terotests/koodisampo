# Repository tekee verkkokutsun. Miten pidät ViewModelin kutsun main-safe-mallisena?

## Tilanne

Androidin Kotlin + Jetpack Compose -kehityksessä olennaista on erottaa UI-tila, sovellustila ja alustapalvelut toisistaan. Compose kuvaa näkymän deklaratiivisesti, ViewModel säilyttää näytön tilan ja repositoryt hoitavat datalähteet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Repository vaihtaa tarvittaessa Dispatchers.IO:lle sisäisesti

Main-safe API:a voi kutsua ViewModelista ilman säieyksityiskohtien vuotamista.

Coroutine ei automaattisesti siirrä työtä IO-säikeelle. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: ViewModelin kutsuja arvaa aina oikean säikeen; Verkkokutsu ajetaan pääsäikeessä koska coroutine.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)

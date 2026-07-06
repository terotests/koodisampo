# Näytön data tulee repositoryltä Flow-muodossa. Miten tuot sen Compose-UI:hin elinkaariturvallisesti?

## Tilanne

Androidin Kotlin + Jetpack Compose -kehityksessä olennaista on erottaa UI-tila, sovellustila ja alustapalvelut toisistaan. Compose kuvaa näkymän deklaratiivisesti, ViewModel säilyttää näytön tilan ja repositoryt hoitavat datalähteet.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Kerää Flow collectAsStateWithLifecycle-funktiolla ViewModelin exposeeraamasta tilasta

Lifecycle-aware keräys pysähtyy ja jatkuu näkymän elinkaaren mukaan.

Recomposition ei saa käynnistää hallitsemattomia coroutineja. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Kutsu runBlocking suoraan Composable-funktiossa; Aloita GlobalScope.launch jokaisessa recompositiossa.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://developer.android.com/develop/ui/compose/state)

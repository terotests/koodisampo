# Sovelluksen pitää tukea selaimen back-nappia webissä ja deep linkkejä. Mikä navigointimalli auttaa?

## Tilanne

Flutterissa käyttöliittymä rakennetaan widget-puuna ja tila pidetään selkeässä state-kerroksessa. Sama koodipohja voi tavoitella mobiilia, webiä ja desktopia, mutta alustakohtaiset plugin-riippuvuudet pitää suunnitella erikseen.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Declarative Router / Navigator 2.0 -tyylinen reittitila

Deklaratiivinen reittitila tekee URL:sta ja sovellustilasta synkronoitavan.

Imperatiivinen push riittää pieniin appeihin, mutta deep linkit vaativat lisää mallia. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Pelkkä Navigator.push ilman reittitilaa aina; Globaali int currentPage ilman URLia.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.flutter.dev/ui/navigation)

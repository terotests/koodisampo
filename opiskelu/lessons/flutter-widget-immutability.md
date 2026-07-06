# Miksi Flutter Widget -objektit ovat käytännössä immutableja?

## Tilanne

Flutterissa käyttöliittymä rakennetaan widget-puuna ja tila pidetään selkeässä state-kerroksessa. Sama koodipohja voi tavoitella mobiilia, webiä ja desktopia, mutta alustakohtaiset plugin-riippuvuudet pitää suunnitella erikseen.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** UI kuvataan uudelleen halvalla; muuttuva tila pidetään State/Notifier-kerroksessa

Flutter erottaa widget-konfiguraation ja pitkäikäisen State-olion.

Tila kuuluu selkeään state-kerrokseen, ei widgetin muuttuviin kenttiin. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Widgetit kirjoittavat suoraan render treehen; Immutable-malli estää kaiken tilan käytön.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.flutter.dev/resources/architectural-overview)

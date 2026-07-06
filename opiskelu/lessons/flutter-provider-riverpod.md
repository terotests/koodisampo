# Usea näkymä tarvitsee samaa kirjautuneen käyttäjän tilaa. Mikä on järkevä state management -periaate?

## Tilanne

Flutterissa käyttöliittymä rakennetaan widget-puuna ja tila pidetään selkeässä state-kerroksessa. Sama koodipohja voi tavoitella mobiilia, webiä ja desktopia, mutta alustakohtaiset plugin-riippuvuudet pitää suunnitella erikseen.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** Yksi jaettu state-lähde esimerkiksi Provider/Riverpod/Bloc-kerroksessa

Jaettu tila estää ristiriidat ja helpottaa testausta.

Build-metodi voi ajautua usein; IO ja kopiot siellä ovat huono malli. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: Kopioi käyttäjäolio jokaisen näytön Stateen; Lue käyttäjä suoraan tiedostosta build()-metodissa.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://docs.flutter.dev/data-and-backend/state-mgmt/intro)

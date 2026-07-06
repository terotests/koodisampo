# Suuri lista pitää näyttää QTableViewissä ja suodattaa. Mikä rakenne sopii?

## Tilanne

Qt 6 on laaja natiivi sovelluskehys desktop- ja sulautettuihin käyttöliittymiin. Sen vahvuuksia ovat signal/slot-malli, Model/View-arkkitehtuuri, Widgets- ja QML-vaihtoehdot sekä hyvät deploy-työkalut.

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** QAbstractTableModel + QSortFilterProxyModel

Qt Model/View erottaa datan, näkymän ja suodatuksen.

Item-widgetit voivat olla helppoja pienessä taulukossa, mutta eivät skaalaa yhtä hyvin. Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: QTableWidget ja tuhansien solujen manuaalikopio aina; Yksi QLabel johon yhdistetään kaikki teksti.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](https://doc.qt.io/qt-6/model-view-programming.html)

# Dialog sulkeutuu ja tuhoutuu, mutta background-worker emitoi edelleen lambdaan, joka käyttää dialogin osoitinta — use-after-free. Miten estät?

## Tilanne

Modalinen `ImportDialog` käynnistää taustatyön ja kuuntelee valmistumista lambdalla:

```cpp
ImportDialog::ImportDialog(ImportWorker *worker, QWidget *parent)
    : QDialog(parent), m_worker(worker)
{
    connect(m_worker, &ImportWorker::finished, [this] {
        m_statusLabel->setText(tr("Valmis"));   // käyttää dialogia
    });
    show();
}
```

Käyttäjä sulkee dialogin ennen valmistumista — `ImportDialog` tuhoutuu. Minuutin kuluttua worker emitoi `finished()` ja lambda käyttää tuhoutuneen dialogin osoitinta. Valgrind raportoi use-after-free -virheen.

Qt katkaisee yhteyden automaattisesti, kun vastaanottaja tai yhteyden context-olio tuhoutuu. Tässä lambdalla ei ole context-oliota, joten yhteys elää niin kauan kuin worker.

## Ratkaisu

Anna dialogi connectille context-olioksi tai katkaise yhteys itse:

```cpp
// context-olio: yhteys katkeaa, kun dialogi tuhoutuu
connect(m_worker, &ImportWorker::finished, this, [this] {
    m_statusLabel->setText(tr("Valmis"));
});

// tai tallenna yhteys ja katkaise se itse:
m_conn = connect(m_worker, &ImportWorker::finished, [this] { /* ... */ });
ImportDialog::~ImportDialog() { disconnect(m_conn); }
```

Context-olion tuhoutuessa Qt katkaisee lambda-yhteyden automaattisesti. Sama pätee tavalliseen jäsenfunktio-slottiin: `connect(worker, &W::finished, this, &ImportDialog::onImportDone)` katkeaa itsestään, kun `this` tuhoutuu.

## Käytännössä

Anna lambda-connectille aina context-olio (yleensä `this`). Code reviewissä etsi `connect`-kutsut, joissa lambda kaappaa osoittimen mutta context-olio puuttuu. Säikeiden välillä context-olio määrää myös, missä säikeessä lambda ajetaan.

[Lue lisää](https://doc.qt.io/qt-6/signalsandslots.html)

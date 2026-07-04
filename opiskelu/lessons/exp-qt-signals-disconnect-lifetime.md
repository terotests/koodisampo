# Dialog sulkeutuu mutta background-worker emitoi edelleen vanhaan slottiin — use-after-free. Miten estät?

## Tilanne

Modalinen `ImportDialog` käynnistää taustatyön ja kuuntelee valmistumista:

```cpp
ImportDialog::ImportDialog(ImportWorker *worker, QWidget *parent)
    : QDialog(parent), m_worker(worker)
{
    connect(m_worker, &ImportWorker::finished,
            this, &ImportDialog::onImportDone);
    show();
}
```

Käyttäjä sulkee dialogin ennen valmistumista — `ImportDialog` tuhoutuu. Minuutin kuluttua worker emitoi `finished()` ja Qt kutsuu slottia tuhoutuneeseen dialogiin. Valgrind raportoi use-after-free -virheen.

Qt ei automaattisesti irrota kaikkia yhteyksiä — elinkaari pitää hallita itse.

## Ratkaisu

Irrota yhteys dialogin sulkeutuessa tai käytä `QPointer` vastaanottajalle:

```cpp
ImportDialog::~ImportDialog() {
    disconnect(m_worker, &ImportWorker::finished,
               this, &ImportDialog::onImportDone);
}

// tai slottiin:
void ImportDialog::onImportDone() {
    QPointer<ImportDialog> guard(this);
    if (!guard) return;
    // ...
}
```

`disconnect` tai `QPointer` receiverille estää slotin kuolleeseen objektiin. Vaihtoehto: anna workerille context-objekti connectissa — yhteys katkeaa automaattisesti kun dialog tuhoutuu.

## Käytännössä

Long-running -tehtävissä yhdistä aina `destroyed`-signaali tai käytä `connect(..., this, ...)` niin että `this` toimii contextina. Code reviewissä etsi connectit, joissa vastaanottaja voi tuhoutua ennen senderiä.

[Lue lisää](https://doc.qt.io/qt-6/signalsandslots.html)

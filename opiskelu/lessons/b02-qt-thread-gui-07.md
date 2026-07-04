# Worker kutsuu suoraan label->setText() — satunnainen crash. Sääntö?

## Tilanne

Taustapalvelin pollaa API:a sekunnin välein:

```cpp
void PollWorker::poll() {
    QString status = fetchStatus();
    m_statusLabel->setText(status);  // suora GUI-kutsu workerista
}
```

Pienellä datamäärällä status päivittyy näyttämään oikealta. Pitkän ajon jälkeen sovellus kaatuu — AddressSanitizer raportoi race conditionin `QLabel`-internallissa.

## Ratkaisu

GUI-luokkiin vain GUI-säikeestä — viesti signaaleilla workerista:

```cpp
void PollWorker::poll() {
    QString status = fetchStatus();
    emit statusUpdated(status);
}

// GUI-säieessä:
connect(worker, &PollWorker::statusUpdated,
        ui->statusLabel, [label = ui->statusLabel](const QString &s) {
    label->setText(s);
}, Qt::QueuedConnection);
```

Qt GUI ei thread-safe — threads-qobject docs. Kaikki widget-operaatiot vastaanottajan säikeessä.

## Käytännössä

Älä välitä widget-pointereita workerille — välitä data signaaleilla. Jos tarvitset invokeMethod:ia: `QMetaObject::invokeMethod(label, "setText", Qt::QueuedConnection, Q_ARG(QString, status))`.

[Lue lisää](https://doc.qt.io/qt-6/threads-technologies.html)

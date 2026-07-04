# Worker-thread emitoi signaalin joka päivittää GUI-labelin — satunnainen crash. Mikä yhteys tyyppi?

## Tilanne

Latausikkunassa `DownloadWorker` pyörii omassa `QThread`-säikeessään. Worker emitoi edistymisen GUI:hin:

```cpp
// worker-threadissa
void DownloadWorker::onChunkReceived(qint64 bytes) {
    m_total += bytes;
    emit progressUpdated(m_total);  // signaali
}
```

Vastaanottaja päivittää labelin suoraan slottissa:

```cpp
void MainWindow::onProgressUpdated(qint64 total) {
    ui->progressLabel->setText(QString::number(total));  // GUI-thread
}
```

Yhteys on luotu oletuksena `Qt::AutoConnection`-tyypillä. Pienellä datalla kaikki toimii; suurella latauksella signaaleja tulee satoja sekunnissa ja sovellus kaatuu satunnaisesti — `QLabel`-objektiin kosketaan worker-säikeestä.

## Ratkaisu

Pakota `Qt::QueuedConnection` threadin välillä — signaali jonoutuu vastaanottajan event loopiin ja slotti ajetaan GUI-säikeessä:

```cpp
connect(worker, &DownloadWorker::progressUpdated,
        this, &MainWindow::onProgressUpdated,
        Qt::QueuedConnection);
```

`QueuedConnection` marshaling event loopiin — Qt signals/slots across threads. Parametrit kopioidaan ja slotti suoritetaan turvallisesti oikeassa säikeessä.

## Käytännössä

Cross-thread -yhteyksissä Qt valitsee usein automaattisesti `QueuedConnection`, mutta pakota se eksplisiittisesti kriittisissä GUI-päivityksissä. Varmista myös, että worker elää signaalin emitoinnin ajan (`QPointer` tai parent-child -suhde).

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

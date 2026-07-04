# Taustasäie kutsuu widget->setText() suoraan — intermittent crash. Sääntö?

## Tilanne

Serial-portin lukija worker-säikeessä:

```cpp
void SerialWorker::onData(const QByteArray &data) {
    m_displayWidget->setText(QString(data));  // widget GUI-säieessä
}
```

Debug-buildissa harvoin crash, release-buildissa useammin. Kehittäjä lisää mutexin workeriin — ongelma jatkuu, koska mutex ei tee GUI-luokista thread-safe.

## Ratkaisu

GUI-objekteja saa koskea vain thread jolla ne luotiin:

```cpp
void SerialWorker::onData(const QByteArray &data) {
    emit dataReceived(QString(data));
}

// GUI-säieessä (connect luotu QueuedConnectionilla):
void MainWindow::onDataReceived(const QString &text) {
    m_displayWidget->setText(text);
}
```

QObject thread affinity — Qt object trees and ownership. Widgetin luontisäie on ainoa säie, josta `setText()` on sallittu.

## Käytännössä

SerialWorker ei saa pitää widget-pointeria — se rikkoo kerrosrajat. Worker emitoi raakadatan; UI-formatointi tapahtuu GUI-säikeessä. Lisää `Q_ASSERT(QThread::currentThread() == widget->thread())` slottiin.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

# Worker-säie kutsuu suoraan QLabel::setText — satunnainen crash. Oikea Qt-malli?

## Tilanne

MQTT-clientti worker-säikeessä vastaanottaa viestejä ja päivittää näytön:

```cpp
void MqttWorker::messageReceived(const QByteArray &payload) {
    ui->topicLabel->setText(QString::fromUtf8(payload));
}
```

`ui->topicLabel` luotiin GUI-säikeessä. Worker ajetaan erillisessä `QThread`:issa. Crash on intermittent — riippuu ajastuksesta ja Qt-version sisäisestä lukituksesta.

## Ratkaisu

Käytä `QueuedConnection` signaalilla worker→GUI tai `QMetaObject::invokeMethod Qt::QueuedConnection`:

```cpp
void MqttWorker::messageReceived(const QByteArray &payload) {
    emit messageReady(QString::fromUtf8(payload));
}

// MainWindow:
connect(m_worker, &MqttWorker::messageReady,
        this, [this](const QString &text) {
    ui->topicLabel->setText(text);
}, Qt::QueuedConnection);
```

GUI objekteilla on thread affinity — Qt Thread docs. Slotti tai lambda ajetaan labelin omistavassa säikeessä.

## Käytännössä

Älä tallenna `ui`-pointeria workeriin — se rohkaisee suoria GUI-kutsuja. Worker emitoi dataa; ikkuna päivittää UI:n. Testaa Thread Sanitizerilla (`-fsanitize=thread`).

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

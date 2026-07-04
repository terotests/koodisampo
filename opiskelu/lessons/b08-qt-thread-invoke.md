# Worker-säie päivittää QLabel:ia suoraan — crash. Oikea tapa kutsua GUI-metodia toisesta säieestä?

## Tilanne

Bluetooth-skanneri worker-säikeessä löytää laitteen:

```cpp
void BleScanner::deviceFound(const QString &name) {
    m_nameLabel->setText(name);  // crash
}
```

Kehittäjä kysyy code reviewissa: "Mikä on oikea tapa kutsua `setText` toisesta säikeestä ilman signaalin lisäämistä?"

## Ratkaisu

`invokeMethod(..., Qt::QueuedConnection)` tai signaali GUI-säikeeseen:

```cpp
void BleScanner::deviceFound(const QString &name) {
    QMetaObject::invokeMethod(m_nameLabel, "setText",
                              Qt::QueuedConnection,
                              Q_ARG(QString, name));
}

// suositeltu — signaali:
emit deviceDiscovered(name);
// connect(..., Qt::QueuedConnection) → label->setText(name)
```

GUI objects live in main thread — invokeMethod queued — threads-qobject. Molemmat postaavat kutsun GUI-event loopiin.

## Käytännössä

Signaalit skaalautuvat paremmin useaan vastaanottajaan. `invokeMethod` on OK yksittäiseen legacy-slottiin. Varmista että label elää kutsun ajankohtana — `QPointer<QLabel>` tai parent-elinkaari.

[Lue lisää](https://doc.qt.io/qt-6/qmetaobject.html#invokeMethod)

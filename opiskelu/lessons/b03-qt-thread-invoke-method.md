# Worker-threadista pitää päivittää label GUI:ssa. Turvallinen Qt-tapa?

## Tilanne

Tiedostovalvonta-worker havaitsee muutoksen ja haluaa päivittää tilanäytön:

```cpp
void FileWatcherWorker::onFileChanged(const QString &path) {
    // worker-säie — label on GUI-säikeessä
    m_label->setText(tr("Muuttunut: %1").arg(path));  // kielletty
}
```

Kehittäjä tietää, ettei suoraa kutsua saa tehdä, mutta tarvitsee tavan kutsua GUI-metodia turvallisesti ilman uutta signaalia (legacy-koodi).

## Ratkaisu

Käytä `QMetaObject::invokeMethod(..., Qt::QueuedConnection)` tai signaalia queued-tyypillä:

```cpp
void FileWatcherWorker::onFileChanged(const QString &path) {
    QMetaObject::invokeMethod(m_label, "setText", Qt::QueuedConnection,
                              Q_ARG(QString, tr("Muuttunut: %1").arg(path)));
}

// tai signaali (suositeltu):
emit fileChanged(path);
// connect(..., Qt::QueuedConnection) → slot päivittää labelin
```

GUI objekteja vain GUI-threadista — queued invoke/signal. `QueuedConnection` postaa kutsun vastaanottajan event loopiin.

## Käytännössä

Signaalit ovat luettavampia kuin `invokeMethod`. `invokeMethod` sopii legacy-sloteille, joihin ei voi lisätä signaalia. Varmista, että string-argumentit ovat rekisteröityjä tyyppejä (`Q_ARG`).

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

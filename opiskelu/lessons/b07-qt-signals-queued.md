# Worker-thread emit signaalin joka päivittää GUI-widgettiä — satunnainen crash. Korjaus?

## Tilanne

Verkkosovelluksessa `NetworkWorker` hakee JSON-dataa taustalla. Tulos välitetään signaalilla:

```cpp
// worker-thread
void NetworkWorker::fetchComplete(const QJsonDocument &doc) {
    emit dataFetched(doc);
}
```

GUI päivittää `QTreeWidget`:in slottimetodissa. Testiautomaatio ajaa sadan requestin sarjan — noin joka kymmenes ajo päättyyy segfaultiin profilerin mukaan widget-päivityksessä.

Signaali ylittää säierajan, mutta yhteys on luotu ennen workerin siirtoa worker-säikeeseen.

## Ratkaisu

Käytä `Qt::QueuedConnection` — slotti ajetaan receiver-threadissa turvallisesti:

```cpp
connect(worker, &NetworkWorker::dataFetched,
        this, &ResultsPanel::populateTree,
        Qt::QueuedConnection);
```

Cross-thread signals need queued connection — Qt Signals and Slots. Parametrit (`QJsonDocument`) kopioidaan event-jonoon ja slotti suoritetaan GUI-säikeessä.

## Käytännössä

Tarkista connect-kohdat code reviewissä: sender ja receiver eri säikeissä → aina `QueuedConnection`. Käytä `Q_ASSERT(QThread::currentThread() == ui->treeWidget->thread())` slottimetodin alussa debug-buildissa.

[Lue lisää](https://doc.qt.io/qt-6/qt.html#ConnectionType-enum)

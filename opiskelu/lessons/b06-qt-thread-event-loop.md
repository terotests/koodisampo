# Worker-thread ei vastaa signaaleihin — slot ei kutsuta. Mitä worker-thread tarvitsee?

## Tilanne

Worker-objekti on siirretty omaan säikeeseensä:

```cpp
m_thread = new QThread;
m_worker = new DataProcessor;
m_worker->moveToThread(m_thread);

connect(this, &Controller::startProcessing, m_worker, &DataProcessor::run);
connect(m_worker, &DataProcessor::done, this, &Controller::onDone);

m_thread->start();
emit startProcessing();
```

`startProcessing`-signaali emitoidaan, mutta `DataProcessor::run()` ei koskaan suoritu. `done`-signaali ei tule.

Worker-säikeessä ei pyöri event loopia — queued-signaaleja ei toimiteta.

## Ratkaisu

Worker-säikeessä tarvitaan `QEventLoop exec()` — event delivery queued connectionille:

```cpp
// Älä override QThread::run() tyhjäksi — oletus kutsuu exec():

// tai eksplisiittisesti worker-luokassa:
void DataProcessor::run() {
    // ... työ ...
    emit done();
}

// connect:
connect(m_thread, &QThread::started, m_worker, &DataProcessor::run);
```

Threads and QObjects — Qt docs thread basics event loop. `QThread::start()` käynnistää oletuksena `exec()`, joka käsittelee queued-tapahtumat.

## Käytännössä

Jos override `QThread::run()`, kutsu lopuksi `exec()` tai älä override ollenkaan — käytä worker-objektia. Debug: `qDebug() << QThread::currentThread()` senderissä ja receiverissä.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

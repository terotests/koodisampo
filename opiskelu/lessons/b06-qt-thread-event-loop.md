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

Worker-säikeessä tarvitaan event loop, eli `QThread::exec()` — oletus-`QThread::run()` kutsuu sen:

```cpp
// Älä override QThread::run():ia ilman exec()-kutsua.
// Worker-objektin kanssa oletus-run() riittää:
m_worker->moveToThread(m_thread);
connect(m_thread, &QThread::started, m_worker, &DataProcessor::run);
m_thread->start();   // run() → exec() → queued-kutsut toimitetaan
```

Tyypillinen virhe on `QThread`-aliluokka, jonka `run()` tekee työn eikä kutsu `exec()`:iä — silloin säikeeseen siirrettyjen objektien slotteja ei koskaan kutsuta.

## Käytännössä

Jos ylikirjoitat `QThread::run()`:n, kutsu siinä `exec()` tai jätä run() ylikirjoittamatta ja käytä worker-objektia. Debug: `qDebug() << QThread::currentThread()` senderissä ja receiverissä.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

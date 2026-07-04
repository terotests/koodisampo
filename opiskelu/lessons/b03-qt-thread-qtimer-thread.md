# QTimer luotu worker-threadissa ei laukea. Mikä sääntö?

## Tilanne

Worker-säikeessä ajetaan polling-logiikkaa ajastimella:

```cpp
void startWorker(QThread *thread) {
    auto *worker = new Worker;
    worker->moveToThread(thread);

    auto *timer = new QTimer(worker);
    connect(timer, &QTimer::timeout, worker, &Worker::poll);
    timer->start(1000);

    thread->start();  // timer ei koskaan laukea
}
```

`QTimer` luodaan ennen event loopin käynnistystä, mutta worker-säikeessä ei pyöri `exec()`. Timeout-signaaleja ei toimiteta.

## Ratkaisu

`QTimer` tarvitsee event loopin siinä threadissa jossa se luotiin:

```cpp
connect(thread, &QThread::started, worker, [timer]() {
    timer->start(1000);
});

// thread->start() käynnistää QThread::exec() oletuksena
// tai worker-slottiin:
void Worker::startPolling() {
    m_timer = new QTimer(this);
    connect(m_timer, &QTimer::timeout, this, &Worker::poll);
    m_timer->start(1000);
}
```

QObject affinity — timer eventit threadin loopiin. `QObject::moveToThread` siirtää ajastimen affinityn worker-säikeeseen — event loop (`exec()`) on pakollinen.

## Käytännössä

Worker-säikeen `QThread::run()` oletuksena kutsuu `exec()` — älä override `run()`:ia ilman loopia, jos käytät `QTimer`:ia tai queued-signaaleja. Käynnistä timer `started`-signaalissa, ei ennen `thread->start()`:ia.

[Lue lisää](https://doc.qt.io/qt-6/qtimer.html)

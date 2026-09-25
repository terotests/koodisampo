# Worker-säikeessä elävä QObject kutsuu deleteLater(), mutta säikeellä ei ole event loopia — objekti ei tuhoudu. Miksi?

## Tilanne

Worker-säikeessä luotu apuobjekti vapautetaan `deleteLater()`:lla:

```cpp
void Worker::run() {             // QThread::run() override ilman exec()
    auto *buffer = new TempBuffer;   // elää worker-säikeessä
    process(buffer);
    buffer->deleteLater();       // poisto ei tapahdu heti
    while (m_running) { doWork(); }  // event loopia ei ajeta
}
```

`deleteLater()` postaa `DeferredDelete`-tapahtuman objektin omaan säikeeseen. Koska worker-säikeessä ei pyöri event loopia, tapahtumaa ei käsitellä ja objekti jää muistiin.

## Ratkaisu

`deleteLater()` on säieturvallinen, mutta poisto tapahtuu vasta objektin omistajasäikeen event loopissa. Anna säikeelle event loop tai tuhoa objekti suoraan omassa säikeessään:

```cpp
// Worker-objekti + QThread: oletus-run() ajaa exec():n
worker->moveToThread(thread);
connect(thread, &QThread::finished, worker, &QObject::deleteLater);
thread->start();

// tai ilman event loopia: tuhoa suoraan omassa säikeessä
delete buffer;
```

Jos säikeessä ei ole event loopia, Qt käsittelee odottavat poistot viimeistään säikeen päättyessä.

## Käytännössä

Objektin thread affinity määrää, missä säikeessä `deleteLater()`-poisto suoritetaan — kutsun voi tehdä mistä säikeestä tahansa. GUI-säikeen objektit poistuvat GUI:n event loopissa. Worker-säikeen objekteille: `connect(thread, &QThread::finished, worker, &QObject::deleteLater)`.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#deleteLater)

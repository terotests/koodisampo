# Paljon lyhyitä taustatehtäviä — uusi QThread jokaiselle on raskasta. Parempi Qt-ratkaisu?

## Tilanne

Web-scraper lähettää 200 HTTP-pyyntöä rinnakkain. Jokaiselle pyynnölle luodaan oma säie:

```cpp
for (const QUrl &url : urls) {
    QThread *t = new QThread;
    auto *fetcher = new UrlFetcher(url);
    fetcher->moveToThread(t);
    t->start();
}
```

Muistinkäyttö nousee, käynnistys on hidas ja osa pyynnöistä timeoutaa. Säie overhead dominoi lyhyissä I/O-tehtävissä.

## Ratkaisu

Käytä `QThreadPool` + `QRunnable` / `QtConcurrent` — uudelleenkäytettävä säiepooli:

```cpp
for (const QUrl &url : urls) {
    QtConcurrent::run([url, this]() {
        QByteArray data = fetch(url);
        QMetaObject::invokeMethod(this, [this, url, data]() {
            onPageFetched(url, data);
        }, Qt::QueuedConnection);
    });
}
```

QThreadPool manages worker threads — Qt Concurrent. Pool kierrättää säikeitä automaattisesti.

## Käytännössä

Aseta `QThreadPool::globalInstance()->setMaxThreadCount(8)` verkkorajoituksen mukaan. Tulosten aggregointi GUI-säikeessä — yksi mutex tai `QMutex` + `QWaitCondition` jos tarvitset synkronointia.

[Lue lisää](https://doc.qt.io/qt-6/qthreadpool.html)

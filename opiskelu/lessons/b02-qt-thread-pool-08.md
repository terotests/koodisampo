# Satoja lyhyitä taustatehtäviä — QThread jokaiselle liian raskas. Vaihtoehto?

## Tilanne

Kuvagalleria generoi thumbnailit 500 kuvalle. Nykyinen toteutus luo uuden `QThread`:in jokaiselle kuvalle:

```cpp
for (const QString &path : imagePaths) {
    auto *thread = new QThread;
    auto *task = new ThumbnailTask(path);
    task->moveToThread(thread);
    thread->start();
    // 500 säiettä — muisti ja kontekstivaihto räjähtävät
}
```

Käynnistys hidastuu, järjestelmä vaihtaa kontekstia jatkuvasti ja osa thumbnail-tehtävistä epäonnistuu resurssipulan takia.

## Ratkaisu

Käytä `QThreadPool` + `QRunnable` tai `QtConcurrent` lyhyille taustatehtäville:

```cpp
class ThumbnailRunnable : public QRunnable {
public:
    void run() override {
        QImage thumb = loadAndScale(m_path, 128);
        emit done(m_path, thumb);  // signaali watcherille
    }
};

QThreadPool::globalInstance()->setMaxThreadCount(
    QThread::idealThreadCount());
for (const QString &path : imagePaths) {
    pool->start(new ThumbnailRunnable(path));
}
```

Thread pool kierrättää säikeitä — QtConcurrent docs. Säiepooli uudelleenkäyttää worker-säikeitä ilman luonti/tuho -overheadia.

## Käytännössä

Lyhyet CPU-tehtävät → `QtConcurrent::run` + `QFutureWatcher`. Pitkät tai event loopia vaativat tehtävät → worker-objekti omalla `QThread`:illa. Aseta `maxThreadCount` järkevästi — yleensä `idealThreadCount()`.

[Lue lisää](https://doc.qt.io/qt-6/qthreadpool.html)

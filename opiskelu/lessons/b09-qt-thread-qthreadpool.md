# Satoja lyhyitä taustatehtäviä — uusi QThread jokaiselle on liian raskasta. Pattern?

## Tilanne

Log-analysaattori parsii 300 logitiedostoa käynnistyksessä:

```cpp
for (const QString &file : logFiles) {
    auto *thread = new QThread;
    auto *parser = new LogParser(file);
    parser->moveToThread(thread);
    connect(thread, &QThread::started, parser, &LogParser::parse);
    thread->start();
}
```

300 säiettä kuluttaa ~300 MB stack-muistia ja hidastaa käynnistystä merkittävästi. Jokainen parsinta kestää vain 50–200 ms.

## Ratkaisu

`QThreadPool` + `QRunnable` — uudelleenkäytettävä säiepooli lyhyille tehtäville:

```cpp
class ParseTask : public QRunnable {
public:
    void run() override {
        ParsedLog result = LogParser::parse(m_file);
        emit parsed(m_file, result);  // via signaalivälittäjä watcherissa
    }
};

auto *pool = QThreadPool::globalInstance();
pool->setMaxThreadCount(QThread::idealThreadCount());

for (const QString &file : logFiles)
    pool->start(new ParseTask(file));
```

QThreadPool hallitsee worker-säikeitä — Qt concurrency. Tehtävät jakautuvat poolin säieisiin ilman luonti/tuho -syklejä.

## Käytännössä

`QRunnable::setAutoDelete(true)` vapauttaa tehtävän automaattisesti. Tulokset aggregoi `QFutureWatcher` tai signaali `QtConcurrent`-tyylisellä watcher-objektilla GUI-säikeessä.

[Lue lisää](https://doc.qt.io/qt-6/qthreadpool.html)

# Raskas laskenta jäädyttää UI-threadin. Mikä Qt-malli siirtää työn taustalle?

## Tilanne

Karttasovellus laskee reitin 10 000 solmun verkossa napin painalluksesta:

```cpp
void MapWindow::onRouteRequested() {
    Route path = computeShortestPath(m_graph, m_start, m_end);
    drawRoute(path);
}
```

`computeShortestPath` vie 5–15 sekuntia. Windows merkitsee ikkunan "Ei vastaa"-tilaan. Käyttäjä yrittää sulkea sovelluksen Task Managerista.

Ratkaisu ei ole `QThread::msleep()` tai progress dialog ilman taustasäiettä — tarvitaan Qt:n worker-malli.

## Ratkaisu

Luo `QObject`-worker, siirrä se `moveToThread(QThread*)`-säikeeseen ja käytä signaaleja:

```cpp
class RouteWorker : public QObject {
    Q_OBJECT
public slots:
    void compute(const Graph &g, Node start, Node end) {
        Route path = computeShortestPath(g, start, end);
        emit routeReady(path);
    }
signals:
    void routeReady(const Route &path);
};

// GUI-säieessä:
auto *thread = new QThread;
auto *worker = new RouteWorker;
worker->moveToThread(thread);
connect(thread, &QThread::started, [=]() { worker->compute(m_graph, m_start, m_end); });
connect(worker, &RouteWorker::routeReady, this, &MapWindow::drawRoute);
thread->start();
```

QObject-worker moveToThread(QThread*)-säikeellä ja signaaleilla. Worker-object threadissä on Qt:n suositeltu malli — doc moveToThread.

## Käytännössä

Graph-objekti on kopioitava tai jaettava turvallisesti workerille. Read-only data voidaan välittää viitteenä, jos worker elää vain yhden tehtävän ajan. Näytä `QProgressDialog` signaalipohjaisella edistymisellä.

[Lue lisää](https://doc.qt.io/qt-6/qthread.html)

# Raskas laskenta jäädyttää GUI:n. Oikea Qt-pattern?

## Tilanne

CAD-sovellus generoi meshin 50 000 kolmiosta napista:

```cpp
void Viewport::onGenerateMesh() {
    Mesh mesh = buildMesh(m_params);  // 20 s, GUI jäätyy
    m_renderer->setMesh(mesh);
}
```

Käyttäjä ei voi peruuttaa, zoomata tai sulkea dialogeja generoinnin aikana. Aiemmin kokeiltu `QThread::create()` ilman event loopia aiheutti uusia ongelmia signaalien kanssa.

## Ratkaisu

Worker `QObject` + `moveToThread(QThread)` — signaalit takaisin GUI:hin:

```cpp
auto *thread = new QThread(this);
auto *worker = new MeshWorker;
worker->moveToThread(thread);

connect(this, &Viewport::generateRequested, worker, &MeshWorker::build);
connect(worker, &MeshWorker::meshReady, this, &Viewport::onMeshReady);
connect(worker, &MeshWorker::meshReady, thread, &QThread::quit);
connect(thread, &QThread::finished, worker, &QObject::deleteLater);
connect(thread, &QThread::finished, thread, &QObject::deleteLater);

thread->start();
emit generateRequested(m_params);
```

Worker object pattern — Qt threading best practice.

## Käytännössä

Peruutus: worker tarkistaa `std::atomic<bool> m_cancelled` loopissa ja emitoi `cancelled()`. Mesh-data siirretään `QSharedPointer`:illa tai move-semantiikalla signaalissa.

[Lue lisää](https://doc.qt.io/qt-6/threads-technologies.html#qthread)

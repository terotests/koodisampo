# OpenGL render crashaa satunnaisesti — QOpenGLWidget luodaan worker-threadissä. Mikä Qt-sääntö rikkoutuu?

## Tilanne

Code review paljastaa:

```cpp
// worker-thread
void RenderWorker::setup() {
    m_glWidget = new QOpenGLWidget();  // CRASH tai UB
    m_glWidget->show();
}
```

Renderöinti toimii satunnaisesti tai kaatuu segfaultilla. OpenGL-konteksti sidotaan luonti-säikeeseen — widget ei saa elää worker-threadissä.

## Ratkaisu

`QOpenGLWidget` luodaan ja käytetään **vain GUI-säikeessä** Qt:n mukaan:

```cpp
// mainwindow.cpp — GUI-thread
MainWindow::MainWindow() {
    m_glWidget = new QOpenGLWidget(this);
    setCentralWidget(m_glWidget);

    m_worker = new RenderWorker;
    m_workerThread = new QThread(this);
    m_worker->moveToThread(m_workerThread);

    connect(m_worker, &RenderWorker::meshReady,
            m_glWidget, [this](const MeshData &mesh) {
        m_glWidget->setMesh(mesh);  // vain data, ei GL widget workerissa
        m_glWidget->update();
    }, Qt::QueuedConnection);

    m_workerThread->start();
}
```

Worker laskee geometrian tai lataa tekstuuritiedostot — GL-konteksti ja widget pysyvät main threadissä.

## Käytännössä

Code review -checklist: `new QOpenGLWidget` vain UI-luontipolussa (main thread). Jos tarvitset offscreen-renderöintiä workerissa, käytä erillistä `QOpenGLContext` + `QOffscreenSurface` ja dokumentoi thread-säännöt. Älä koskaan `moveToThread` OpenGL-widgetille.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

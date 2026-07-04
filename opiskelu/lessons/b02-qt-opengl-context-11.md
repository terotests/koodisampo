# OpenGL renderöinti toisesta threadista — mitä tarvitaan ennen glCall?

## Tilanne

Haluat renderöidä taustalla erillisessä säikeessä ja kutsua suoraan `glDrawArrays`:ia worker-loopissa. Ilman oikeaa kontekstin hallintaa saat crashin tai hiljaisen epäonnistumisen — OpenGL-konteksti on sidottu säikeeseen.

## Ratkaisu

`QOpenGLContext::makeCurrent()` oikeassa säikeessä ennen glCall-komentoja:

```cpp
void GLRenderThread::run() {
    m_context = new QOpenGLContext;
    m_context->setFormat(m_shareContext->format());
    m_context->setShareContext(m_shareContext);
    m_context->create();

    m_surface = new QOffscreenSurface;
    m_surface->setFormat(m_context->format());
    m_surface->create();

    m_context->makeCurrent(m_surface);

    initializeOpenGLFunctions();
    setupShaders();
    setupBuffers();

    while (!isInterruptionRequested()) {
        m_context->makeCurrent(m_surface);
        renderFrame();
        m_context->doneCurrent();
        emit frameReady(m_textureId);
    }
}
```

Konteksti luodaan render-säikeessä, `makeCurrent()` aktivoi sen ennen jokaista GL-kutsua.

## Käytännössä

GUI-threadin widget-konteksti ja worker-konteksti voivat jakaa resurssit `setShareContext()`:lla. Älä kutsu widgetin `paintGL()`:ää workerista — lähetä valmis tekstuuri signaalilla UI:lle. Dokumentoi: yksi current-konteksti per säie kerrallaan.

[Lue lisää](https://doc.qt.io/qt-6/qopenglcontext.html)

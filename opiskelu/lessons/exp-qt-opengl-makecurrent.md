# Render loopissa glError invalid operation — context ei aktiivinen. Mitä kutsut ennen GL-komentoja?

## Tilanne

Offscreen-render loopissa tai jaetun kontekstin kanssa:

```cpp
void RenderLoop::frame() {
    glBindFramebuffer(GL_FRAMEBUFFER, m_fbo);  // GL_INVALID_OPERATION
    glDrawArrays(GL_TRIANGLES, 0, count);
}
```

`glGetError()` palauttaa `GL_INVALID_OPERATION`. Konteksti ei ole aktiivinen tässä säikeessä — edellinen frame jätti sen toiseen säikeeseen tai `doneCurrent()` kutsuttiin liian aikaisin.

## Ratkaisu

Kutsu `context->makeCurrent(surface)` ennen GL:ää, `doneCurrent()` lopuksi:

```cpp
void RenderLoop::frame() {
    QOpenGLContext *ctx = QOpenGLContext::currentContext();
    QSurface *surface = ctx ? ctx->surface() : m_offscreenSurface;

    if (!m_context->makeCurrent(surface)) {
        qWarning("makeCurrent failed");
        return;
    }

    glBindFramebuffer(GL_FRAMEBUFFER, m_fbo);
    glViewport(0, 0, m_width, m_height);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    m_shaderProgram.bind();
    glDrawArrays(GL_TRIANGLES, 0, m_vertexCount);

    m_context->swapBuffers(surface);  // jos onscreen
    m_context->doneCurrent();
}
```

`makeCurrent()` aktivoi kontekstin nykyiselle säikeelle ja pinnalle. Ilman sitä GL-komennot ovat virheellisiä.

## Käytännössä

Jaetussa kontekstissa: aina `makeCurrent()` ennen GL-kutsuja, vaikka "tietäisit" kontekstin olevan sama. Offscreen: luo `QOffscreenSurface` samalla `QSurfaceFormat`:illa kuin pääkonteksti. Debuggauksessa kääri GL-kutsut makroon, joka tarkistaa current-kontekstin olemassaolon.

[Lue lisää](https://doc.qt.io/qt-6/qopenglcontext.html)

# OpenGL-kutsu kaatuu 'without current context'. Mitä teet ennen glDrawArrays?

## Tilanne

Debug-logissa Qt varoittaa: *"QOpenGLFunctions::glDrawArrays called without current context"*. Koodi kutsuu GL:ää helper-luokasta, joka ei aktivoi kontekstia — esim. `initializeGL()`:n ulkopuolelta tai toisen widgetin kontekstilla.

## Ratkaisu

`makeCurrent()` kontekstille — OpenGL on thread-local:

```cpp
void MeshDrawer::draw(QOpenGLWidget *widget) {
    if (!widget->context()->makeCurrent(widget->defaultFramebufferObject()
            ? widget->context()->surface()
            : nullptr)) {
        widget->makeCurrent();  // QOpenGLWidget-apu
    }

    m_shaderProgram.bind();
    m_vao.bind();
    glDrawArrays(GL_TRIANGLES, 0, m_vertexCount);
    m_vao.release();

    widget->doneCurrent();
}

void MyGLWidget::paintGL() {
    makeCurrent();  // paintGL:ssä riittää widgetin makeCurrent()
    m_drawer.draw(this);
}
```

`QOpenGLWidget::makeCurrent()` aktivoi widgetin kontekstin ja FBO:n piirtopinnalle.

## Käytännössä

Kaikki raa'at GL-kutsut (myös `glGenTextures`, `glDeleteBuffers`) vaativat current-kontekstin. Helper-luokat voivat ottaa `QOpenGLWidget*` parametrina ja kutsua `makeCurrent()` alussa. `QOpenGLExtraFunctions`/`initializeOpenGLFunctions()` toimii vain current-kontekstissa kutsuttuna.

[Lue lisää](https://doc.qt.io/qt-6/qopenglcontext.html#makeCurrent)

# Moderni Qt OpenGL piirtää suorakulmion — mitä objekteja bindataan?

## Tilanne

Core Profile -projektissa fixed-function `glRectf` ei toimi. Piirrät yksinkertaisen suorakulmion shader-pipelinella — mitkä Qt OpenGL -objektit tarvitaan ennen `glDrawArrays`:ia?

## Ratkaisu

Bindaa `QOpenGLVertexArrayObject` + `QOpenGLBuffer` (VBO) + shader program:

```cpp
void RectWidget::initializeGL() {
    static const float quad[] = {
        -0.5f, -0.5f,
         0.5f, -0.5f,
         0.5f,  0.5f,
        -0.5f,  0.5f,
    };

    m_shaderProgram.addShaderFromSourceFile(QOpenGLShader::Vertex, ":/shaders/rect.vert");
    m_shaderProgram.addShaderFromSourceFile(QOpenGLShader::Fragment, ":/shaders/rect.frag");
    m_shaderProgram.link();

    m_vbo.create();
    m_vbo.bind();
    m_vbo.allocate(quad, sizeof(quad));

    m_vao.create();
    m_vao.bind();
    m_shaderProgram.enableAttributeArray("aPos");
    m_shaderProgram.setAttributeBuffer("aPos", GL_FLOAT, 0, 2);
    m_vao.release();
    m_vbo.release();
}

void RectWidget::paintGL() {
    makeCurrent();
    glClear(GL_COLOR_BUFFER_BIT);

    m_shaderProgram.bind();
    m_vao.bind();
    glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
    m_vao.release();
}
```

VAO kapseloi vertex-asettelun, VBO pitää kulmat, shader program määrittää piirtoputken.

## Käytännössä

Luo VAO/VBO `initializeGL()`:ssä — älä bindaa joka framella uudelleen jos layout ei muutu (bind on halpa, mutta recreate ei). Uniformit (väri, transform) asetetaan shaderProgram.bind():in jälkeen. macOS vaatii Core Profilen — aseta `QSurfaceFormat` ennen widgetin luontia.

[Lue lisää](https://doc.qt.io/qt-6/qopenglvertexarrayobject.html)

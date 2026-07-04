# Piirrät paljon kolmioita QOpenGLWidgetissä. Miten vältät turhat CPU→GPU-kopiointi joka framella?

## Tilanne

Jokaisella framella kutsut `glVertexAttribPointer`-tyyppisiä asetuksia ja lähetät saman geometrian uudelleen CPU:sta GPU:lle. Tuhansien kolmioiden kanssa CPU kuormittuu ja frame rate laskee — data kulkee turhaan väylän yli joka kerta.

## Ratkaisu

Käytä `QOpenGLBuffer` (VBO) ja vertex attrib -asetuksia: lataa geometria kerran, piirrä usein:

```cpp
void MeshRenderer::initializeGL() {
    static const float vertices[] = {
        -0.5f, -0.5f, 0.0f,
         0.5f, -0.5f, 0.0f,
         0.0f,  0.5f, 0.0f,
    };

    m_vbo.create();
    m_vbo.bind();
    m_vbo.allocate(vertices, sizeof(vertices));

    m_vao.create();
    m_vao.bind();
    m_shaderProgram.enableAttributeArray(0);
    m_shaderProgram.setAttributeBuffer(0, GL_FLOAT, 0, 3);
    m_vao.release();
    m_vbo.release();
}

void MeshRenderer::paintGL() {
    makeCurrent();
    m_shaderProgram.bind();
    m_vao.bind();
    glDrawArrays(GL_TRIANGLES, 0, 3);
    m_vao.release();
}
```

VBO pitää vertex-datan GPU-muistissa. Framella bindataan vain buffer ja attrib pointerit — ei uudelleenkopiointia.

## Käytännössä

Lataa staattinen mesh `initializeGL()`:ssä tai `QOpenGLWidget::aboutToCompose`-hetkellä. Dynaamiselle datalle käytä `QOpenGLBuffer::DynamicDraw` ja päivitä vain muuttuneet alueet `write()`:lla. Profiloi: ilman VBO:ta `glBufferSubData` joka framella on yleisin pullonkaula.

[Lue lisää](https://doc.qt.io/qt-6/qopenglbuffer.html)

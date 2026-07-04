# Piirrät meshiä joka frame ilman buffer-objekteja — CPU bottleneck. Ensimmäinen OpenGL-optimointi?

## Tilanne

Render loopissa kutsut suoraan client-side vertex-taulukosta:

```cpp
void paintGL() {
    glBegin(GL_TRIANGLES);  // legacy — ei edes core profilessa
    // ...
}
// tai immediate mode -tyylinen glVertex3f joka framella
```

CPU kuluttaa aikaa datan lähettämiseen driverille joka frame. Tämä on klassinen pullonkaula ennen muita optimointeja.

## Ratkaisu

`QOpenGLBuffer` (VBO) + VAO: lataa kerran, piirrä usein per frame:

```cpp
void GLMeshView::initializeGL() {
    m_vbo.create();
    m_vbo.bind();
    m_vbo.allocate(m_vertices.constData(), m_vertices.size() * sizeof(Vertex));

    m_vao.create();
    m_vao.bind();

    m_shaderProgram.enableAttributeArray(0);
    m_shaderProgram.setAttributeBuffer(0, GL_FLOAT,
        offsetof(Vertex, pos), 3, sizeof(Vertex));

    m_shaderProgram.enableAttributeArray(1);
    m_shaderProgram.setAttributeBuffer(1, GL_FLOAT,
        offsetof(Vertex, uv), 2, sizeof(Vertex));

    m_vao.release();
    m_vbo.release();
}

void GLMeshView::paintGL() {
    makeCurrent();
    m_shaderProgram.bind();
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexCount, GL_UNSIGNED_INT, nullptr);
    m_vao.release();
}
```

VAO tallentaa attrib-asetukset; VBO pitää datan GPU:lla. Framella riittää bind + draw.

## Käytännössä

Tee optimointi ennen instancingia, occlusion cullingia tai LOD:ia — VBO/VAO on ensimmäinen askel. Profiloi `QElapsedTimer`:llä: bind/draw ilman buffer-objekteja vs. VBO/VAO. Useat meshit → yksi VBO eri offseteilla tai erilliset VAO:t per mesh.

[Lue lisää](https://doc.qt.io/qt-6/qopenglbuffer.html)

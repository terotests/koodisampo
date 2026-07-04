# Legacy fixed-function GL-kutsu kaataa macOS:llä — toimii Linuxilla. Konteksti?

## Tilanne

Koodi käyttää `glBegin`/`glEnd` tai `glMatrixMode`:

```cpp
void paintGL() {
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glBegin(GL_QUADS);
    glVertex3f(-1, -1, 0);
    // ...
    glEnd();
}
```

Linux/Windows compatibility profile sallii nämä. macOS kaataa tai antaa virheen — Apple vaatii **OpenGL Core Profile** ilman deprecated fixed pipelinea.

## Ratkaisu

Pyydä Core Profile ja poista deprecated fixed pipeline:

```cpp
int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    QSurfaceFormat fmt;
    fmt.setVersion(3, 3);
    fmt.setProfile(QSurfaceFormat::CoreProfile);
    fmt.setDepthBufferSize(24);
    QSurfaceFormat::setDefaultFormat(fmt);

    MainWindow w;
    w.show();
    return app.exec();
}
```

Shader-pohjainen piirto korvaa fixed-function kutsut:

```cpp
void paintGL() {
    makeCurrent();
    m_shaderProgram.bind();
    m_shaderProgram.setUniformValue("uMVP", m_projection * m_view * m_model);
    m_vao.bind();
    glDrawArrays(GL_TRIANGLES, 0, 6);
}
```

## Käytännössä

Aseta `QSurfaceFormat` **ennen** ensimmäistä `QOpenGLWidget`-instanssia — `main()`:ssä tai `QApplication`-konstruktorin jälkeen heti. Testaa macOS:llä CI:ssä. Migroi `gluPerspective` → glm/QMatrix4x4 + uniform. Core Profile = ei immediate mode, ei matrix stack.

[Lue lisää](https://doc.qt.io/qt-6/qsurfaceformat.html)

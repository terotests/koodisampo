# Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Miten jaat resurssit?

## Tilanne

Kaksi GL-näkymää näyttää samaa 3D-mallia eri kuvakulmista. Kumpikin lataa tekstuurit ja VBO:t omassa `initializeGL()`:ssään — GPU-muisti ja käynnistysaika kasvavat turhaan.

## Ratkaisu

`QOpenGLWidget::setShareContext` tai shared context group:

```cpp
void setupGlWidgets(QOpenGLWidget *primary, QOpenGLWidget *secondary) {
    QSurfaceFormat fmt;
    fmt.setVersion(3, 3);
    fmt.setProfile(QSurfaceFormat::CoreProfile);
    fmt.setDepthBufferSize(24);
    QSurfaceFormat::setDefaultFormat(fmt);

    // Primary luo master-kontekstin
    primary->makeCurrent();
    GLuint sharedTex = loadTextureOnce(":/assets/albedo.png");

    // Secondary jakaa saman share groupin
    secondary->setShareContext(primary->context());
    secondary->makeCurrent();
    // sharedTex on validi myös secondary-kontekstissa
    glBindTexture(GL_TEXTURE_2D, sharedTex);
}
```

Share group jakaa nimettyjen GL-resurssien (texture, buffer, shader) identiteetit.

## Käytännössä

Luo ja lataa jaetut resurssit primary-widgetin `initializeGL()`:ssä. Secondary käyttää samoja ID:itä — ei uudelleenlatausta. Synkronoi: älä poista jaettua tekstuuria toisen widgetin ollessa piirtämässä. Debuggauksessa tarkista `QOpenGLContext::shareGroup()`.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

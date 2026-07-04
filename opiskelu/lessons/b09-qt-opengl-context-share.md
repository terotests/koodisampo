# Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Optimointi?

## Tilanne

Refaktorointi erotti 3D-näkymän ja materiaali-esikatselun omiksi widgeteiksi. Profilointi näyttää kaksi identtistä `glTexImage2D`-kutsua käynnistyksessä ja kaksinkertaisen VRAM-käytön samalle atlakselle.

## Ratkaisu

`QSurfaceFormat setSharedContext` — jaetut GL-resurssit widgetien välillä:

```cpp
class MaterialPreviewApp : public QMainWindow {
public:
    MaterialPreviewApp() {
        QSurfaceFormat fmt;
        fmt.setVersion(4, 1);
        fmt.setProfile(QSurfaceFormat::CoreProfile);
        fmt.setDepthBufferSize(24);
        QSurfaceFormat::setDefaultFormat(fmt);

        m_sceneView = new QOpenGLWidget;
        m_preview   = new QOpenGLWidget;

        setCentralWidget(m_sceneView);
        m_preview->setFixedSize(256, 256);
        addDockWidget(Qt::RightDockWidgetArea,
                      wrapInDock(m_preview, tr("Esikatselu")));

        // Scene luo master-kontekstin
        m_sceneView->show();
        m_preview->setShareContext(m_sceneView->context());
    }
};

// Jaettu lataus — kerran master-kontekstissa
void SharedTextures::load(QOpenGLContext *ctx) {
    ctx->makeCurrent(ctx->surface());
    if (m_atlasId == 0)
        m_atlasId = createAtlas(":/textures/atlas.png");
}
```

Optimointi: yksi lataus, kaksi näkymää — sama texture ID molemmissa.

## Käytännössä

Share context ennen secondary-widgetin ensimmäistä `initializeGL()`:ää. Dokumentoi jaetut resurssit selkeästi — kuka omistaa delete-kutsun (`glDeleteTextures` vain kerran). Testaa: secondary-widgetin `paintGL()` bindaa jaetun tekstuurin ilman uudelleenlatausta.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

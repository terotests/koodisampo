# Kaksi QOpenGLWidget:iä — tekstuurit ladataan kahdesti. Miten jaat GL-resurssit?

## Tilanne

Sovelluksessa on esikatselu- ja editori-widget, molemmat lataavat saman 4K-tekstuurin:

```cpp
void PreviewWidget::initializeGL() { loadTexture("model.png"); }
void EditorWidget::initializeGL()  { loadTexture("model.png"); }  // duplikaatti GPU:lla
```

Muisti kaksinkertaistuu ja latausaika tuplaantuu — widgeteillä on erilliset OpenGL-kontekstit oletuksena.

## Ratkaisu

`QOpenGLWidget::setShareContext()` / shared OpenGL context widgetien välillä:

```cpp
MainWindow::MainWindow() {
    QSurfaceFormat fmt;
    fmt.setDepthBufferSize(24);
    QSurfaceFormat::setDefaultFormat(fmt);

    m_preview = new QOpenGLWidget(this);
    m_editor  = new QOpenGLWidget(this);

    // Editor luo kontekstin ensin — preview jakaa sen
    m_editor->show();  // varmistaa kontekstin luonnin
    m_preview->setShareContext(m_editor->context());

    m_textureLoader = new TextureLoader(m_editor->context());
    connect(m_textureLoader, &TextureLoader::loaded,
            this, &MainWindow::onTextureReady);
}
```

Shared context jakaa texture-, buffer- ja shader-ID:t widgetien välillä. Lataa tekstuuri kerran, bindaa molemmissa.

## Käytännössä

Share group täytyy asettaa ennen kuin toinen widget luo oman kontekstinsa — tyypillisesti ensimmäisen widgetin `context()` jaettavaksi toiselle. Vain yksi widget kerrallaan voi olla current samassa kontekstissa — käytä `makeCurrent()` oikeassa widgetissä. Jaetut kontekstit vaativat saman `QSurfaceFormat`:in.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

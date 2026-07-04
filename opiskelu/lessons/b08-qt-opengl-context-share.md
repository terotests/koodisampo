# Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Miten jaat GL-resurssit?

## Tilanne

Minimap ja pää-näkymä ovat erillisiä `QOpenGLWidget`:eja. Molemmat kutsuvat `QOpenGLTexture`-luontia samalle kartalle — VRAM-käyttö tuplaantuu ja käynnistyksessä näkyy kaksi latausspinneriä.

## Ratkaisu

`QSurfaceFormat setShareContext` — sama `QOpenGLContext` share group:

```cpp
void setupSharedGlViews(QWidget *parent) {
    auto *mainView  = new QOpenGLWidget(parent);
    auto *miniMap   = new QOpenGLWidget(parent);

    QSurfaceFormat fmt;
    fmt.setDepthBufferSize(24);
    mainView->setFormat(fmt);
    miniMap->setFormat(fmt);

    // Main view luo kontekstin — minimap jakaa share groupin
    mainView->makeCurrent();
    SharedGlResources::instance().init(mainView->context());

    miniMap->setShareContext(mainView->context());

    miniMap->makeCurrent();
    // SharedGlResources::terrainTextureId() toimii suoraan
}
```

Share group tarkoittaa, että GL-objektien nimet (texture ID jne.) ovat samat kaikissa jaetuissa konteksteissa.

## Käytännössä

Keskitä jaettu resurssien lataus singletoniin, joka ottaa master-kontekstin parametrina. Varmista `makeCurrent()` oikeassa widgetissä ennen bind/draw. Kontekstien täytyy olla samassa share groupissa ennen resurssien luontia secondary-widgetissä.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

# Kaksi QOpenGLWidget:iä — tekstuurit ladataan kahdesti. Miten jaat GL-resurssit?

## Tilanne

Sovelluksessa on esikatselu- ja editori-widget eri ikkunoissa, ja molemmat lataavat saman 4K-tekstuurin:

```cpp
void PreviewWidget::initializeGL() { loadTexture("model.png"); }
void EditorWidget::initializeGL()  { loadTexture("model.png"); }  // duplikaatti GPU:lla
```

Muisti kaksinkertaistuu ja latausaika tuplaantuu — eri ikkunoissa olevien widgetien kontekstit eivät oletuksena jaa resursseja.

## Ratkaisu

`QOpenGLWidget`illä ei ole `setShareContext()`-metodia. Samassa ylätason ikkunassa olevat `QOpenGLWidget`it jakavat resurssit automaattisesti. Eri ikkunoiden välillä jako otetaan käyttöön `Qt::AA_ShareOpenGLContexts`-attribuutilla ennen `QApplication`-olion luontia:

```cpp
int main(int argc, char *argv[]) {
    QSurfaceFormat fmt;
    fmt.setDepthBufferSize(24);
    QSurfaceFormat::setDefaultFormat(fmt);

    QCoreApplication::setAttribute(Qt::AA_ShareOpenGLContexts);
    QApplication app(argc, argv);

    MainWindow w;   // preview ja editor eri ikkunoissa
    w.show();
    return app.exec();
}
```

Jaettu konteksti jakaa texture-, buffer- ja shader-ID:t widgetien välillä. Lataa tekstuuri kerran, bindaa molemmissa. Omia `QOpenGLContext`-olioita käyttäessä jako asetetaan `QOpenGLContext::setShareContext()`-kutsulla ennen `create()`-kutsua.

## Käytännössä

Attribuutti pitää asettaa ennen `QApplication`-olion luontia, muuten sillä ei ole vaikutusta. Jaetut resurssit (tekstuurit, bufferit) näkyvät kaikille, mutta VAO:t ja FBO:t eivät jakaudu kontekstien välillä. Kutsu `makeCurrent()` oikeassa widgetissä ennen GL-kutsuja paintGL():n ulkopuolella. Jaetut kontekstit vaativat yhteensopivan `QSurfaceFormat`:in.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

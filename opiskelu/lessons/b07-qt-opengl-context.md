# QOpenGLWidget renderöi mustaa — context ei ole current. Mitä kutsutaan ennen piirtoa?

## Tilanne

Qt-sovelluksessa `QOpenGLWidget` näyttää mustan ruudun. `glClear` ja piirtokomennot eivät näy. Debuggerissa GL-virheitä ei välttämättä näy — komennot ajetaan **ilman current OpenGL-kontekstia** ja vaikutus menee "tyhjyyteen".

OpenGL vaatii aina aktiivisen kontekstin säikeessä, joka piirtää.

## Ratkaisu

Kutsu `makeCurrent()` ennen GL-komentoja:

```cpp
void MyGLWidget::paintGL() {
    makeCurrent();
    glClear(GL_COLOR_BUFFER_BIT);
    // ... piirto ...
    doneCurrent();  // valinnainen jos jaat kontekstia säikeiden välillä
}
```

`QOpenGLWidget::paintGL()` kutsutaan Qt:n renderöintiputkeesta — `makeCurrent()` on pakollinen jos käytät raakoja GL-kutsuja tai FBO:ta widgetin ulkopuolelta.

## Käytännössä

Suosi `QOpenGLFunctions` tai modernia Qt RHI/QRhi-API:a uusissa projekteissa. Jos käytät `QOpenGLWidget`:iä: varmista myös validi shader-program ja viewport-koko. Musta ruutu voi johtua myös väärästä clear colorista — mutta current-konteksti on ensimmäinen tarkistus.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

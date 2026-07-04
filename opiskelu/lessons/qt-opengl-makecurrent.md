# QOpenGLWidget piirtää mustaa. OpenGL-kutsut tehdään väärästä säikeestä. Ensimmäinen korjaus?

## Tilanne

`QOpenGLWidget`-sovelluksessa ruutu pysyy mustana. GL-komennot ajetaan worker-säikeestä tai `paintGL()`:n ulkopuolelta ilman kontekstin aktivointia. OpenGL-konteksti on **säikeekohtainen** — komennot vaikuttavat vain säikeessä, jossa konteksti on current.

## Ratkaisu

Kutsu `makeCurrent()` widgetin kontekstissa ennen GL-komentoja:

```cpp
void MyGLWidget::renderFromWorker() {
    // VÄÄRIN: glClear() suoraan worker-threadistä ilman makeCurrent()

    // OIKEIN: aktivoi konteksti ensin (GUI-säikeessä!)
    QMetaObject::invokeMethod(this, [this]() {
        makeCurrent();
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        // ... piirto ...
        doneCurrent();
        update();
    }, Qt::QueuedConnection);
}

void MyGLWidget::paintGL() {
    makeCurrent();  // varmista current myös paintGL:ssä
    m_shaderProgram.bind();
    glDrawArrays(GL_TRIANGLES, 0, 3);
}
```

`makeCurrent()` sitoo OpenGL-kontekstin nykyiseen säikeeseen. Ilman sitä komennot eivät piirry widgetille.

## Käytännössä

`QOpenGLWidget` luodaan ja käytetään aina GUI-säikeessä. Jos tarvitset taustarenderöintiä, siirrä data workeriin mutta GL-kutsut takaisin main threadiin `QMetaObject::invokeMethod`- tai signaali/slot-yhteydellä. Tarkista virheet: `glGetError()` palauttaa usein `GL_INVALID_OPERATION` ilman current-kontekstia.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

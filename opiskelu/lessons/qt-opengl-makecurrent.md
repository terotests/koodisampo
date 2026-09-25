# QOpenGLWidget piirtää mustaa. GL-kutsut tehdään paintGL():n ulkopuolelta (esim. latausmetodissa). Ensimmäinen korjaus?

## Tilanne

`QOpenGLWidget`-sovelluksessa ruutu pysyy mustana. GL-komennot (esim. tekstuurin lataus) ajetaan `paintGL()`:n ulkopuolelta, eikä widgetin konteksti ole silloin current. Qt tekee kontekstin currentiksi vain `initializeGL()`-, `resizeGL()`- ja `paintGL()`-kutsujen ajaksi.

## Ratkaisu

Kutsu `makeCurrent()` widgetin kontekstissa ennen GL-komentoja:

```cpp
void MyGLWidget::loadTexture(const QImage &img) {
    makeCurrent();                   // aktivoi widgetin konteksti
    m_texture = new QOpenGLTexture(img);
    doneCurrent();
    update();                        // pyydä uusi frame
}

void MyGLWidget::paintGL() {
    // konteksti on jo current — Qt hoitaa tämän
    m_shaderProgram.bind();
    glDrawArrays(GL_TRIANGLES, 0, 3);
}
```

`makeCurrent()` sitoo widgetin OpenGL-kontekstin nykyiseen säikeeseen. Ilman sitä komennot osuvat väärään kontekstiin tai eivät tee mitään.

## Käytännössä

`QOpenGLWidget` luodaan ja käytetään aina GUI-säikeessä — `makeCurrent()` toisesta säikeestä ei toimi. Jos tarvitset taustarenderöintiä, valmistele data workerissa mutta tee GL-kutsut GUI-säikeessä `QMetaObject::invokeMethod`- tai signaali/slot-yhteydellä. Tarkista virheet: `glGetError()` palauttaa usein `GL_INVALID_OPERATION` ilman current-kontekstia.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

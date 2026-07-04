# OpenGL rendering flicker — piirto näkyy kesken renderöinnin. Mitä format-optiota?

## Tilanne

Animaatiossa näet edellisen framen puolivalmiin tilan — objektit välkkyvät tai "repivät". Piirto tapahtuu suoraan näytön front bufferiin ilman double bufferingia tai swap tapahtuu kesken piirron.

## Ratkaisu

`QSurfaceFormat` double buffering — swap buffers estää flickerin renderöinnissä:

```cpp
int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    QSurfaceFormat fmt;
    fmt.setSwapBehavior(QSurfaceFormat::DoubleBuffer);
    fmt.setDepthBufferSize(24);
    QSurfaceFormat::setDefaultFormat(fmt);

    GLWidget w;
    w.show();
    return app.exec();
}

void GLWidget::paintGL() {
    makeCurrent();
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    // piirretään back bufferiin
    drawScene();
    // Qt swapaa automaattisesti paintGL():n jälkeen
}
```

Double buffering piirtää back bufferiin ja näyttää valmiin framen swapilla — käyttäjä ei näe kesken jäänyttä piirtoa.

## Käytännössä

Nykyiset Qt/OpenGL-ajurit käyttävät double bufferia oletuksena — flicker johtuu useammin piirtämisestä `paintGL()`:n ulkopuolella tai `swapBuffers()`:n manuaalisesta väärästä ajankohdasta. Single buffer (`QSurfaceFormat::SingleBuffer`) vain erikoistapauksiin. Yhdistä vsync (`setSwapInterval(1)`) tasaisempaan animaatioon.

[Lue lisää](https://doc.qt.io/qt-6/qsurfaceformat.html)

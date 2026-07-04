# Renderöinti repii ruudulla liikkuessa — tearing. Swap interval?

## Tilanne

Kamera liikkuu nopeasti 3D-kentässä ja kuva "repii" vaakasuunnassa — yläosa ja alaosa näyttävät eri hetkiltä. Näyttö päivittyy kesken framen koska buffer swap tapahtuu näytön skannauksen aikana ilman vertical synciä.

## Ratkaisu

`QSurfaceFormat::setSwapInterval(1)` — VSync päälle tearingin estämiseksi:

```cpp
int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    QSurfaceFormat fmt;
    fmt.setVersion(3, 3);
    fmt.setProfile(QSurfaceFormat::CoreProfile);
    fmt.setDepthBufferSize(24);
    fmt.setSwapBehavior(QSurfaceFormat::DoubleBuffer);
    fmt.setSwapInterval(1);  // odota VBlank ennen swapia
    QSurfaceFormat::setDefaultFormat(fmt);

    ViewerWindow window;
    window.show();
    return app.exec();
}

void ViewerWidget::paintGL() {
    makeCurrent();
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    updateCamera();
    drawWorld();
    // Qt kutsuu swapBuffers() vsyncin mukaisesti
}
```

Swap interval 1 sitoo buffer-vaihdon näytön virkistykseen — koko frame näkyy kerralla.

## Käytännössä

Tearing vs. latency: kilpapelaamisessa joskus `setSwapInterval(0)` + frame limiter. Yleiskäyttöön vsync päälle. Jos tearing jatkuu, tarkista ajurin "VSync forced off" -asetus ja compositor (Wayland vs X11). Triple buffering voi auttaa joillain ajureilla mutta Qt hallitsee pääasiassa double buffer + swap interval.

[Lue lisää](https://doc.qt.io/qt-6/qsurfaceformat.html#setSwapInterval)

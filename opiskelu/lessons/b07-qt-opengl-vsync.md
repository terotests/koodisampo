# Peli renderöi 300 FPS ja kuluttaa CPU:ta turhaan. Miten rajoitat frame ratea?

## Tilanne

Peli-loop kutsuu `update()` jatkuvasti tight loopissa tai hyvin lyhyellä timerilla. FPS on 200–400, CPU 100 % yhdellä ytimellä — turhaa työtä, koska näyttö päivittyy vain ~60 Hz.

## Ratkaisu

`QSurfaceFormat` swap interval (vsync) tai `QTimer` frame pacing:

```cpp
// Vaihtoehto 1: VSync (suositus pelissä)
int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    QSurfaceFormat fmt;
    fmt.setSwapInterval(1);  // odota näytön vertical blank
    fmt.setSwapBehavior(QSurfaceFormat::DoubleBuffer);
    QSurfaceFormat::setDefaultFormat(fmt);

    GameWindow w;
    w.show();
    return app.exec();
}

// Vaihtoehto 2: QTimer ilman vsynciä (esim. headless-testi)
GameWidget::GameWidget() {
    connect(&m_frameTimer, &QTimer::timeout, this, QOverload<>::of(&QWidget::update));
    m_frameTimer.start(16);  // ~60 FPS
}
```

Swap interval 1 synkronoi buffer swapin näytön virkistystaajuuteen.

## Käytännössä

Vältä `while(true) { update(); }` — se polttaa CPU:ta. `setSwapInterval(1)` riippuu ajurista; jos vsync ei toimi (etätyöpöytä), käytä `QTimer` + `QElapsedTimer` delta-aikaan. `setSwapInterval(0)` vain benchmarkkeihin. Profiloi: rajoittamaton FPS nostaa lämpöä ja akunkulutusta kannettavalla.

[Lue lisää](https://doc.qt.io/qt-6/qsurfaceformat.html)

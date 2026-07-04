# OpenGL-demo repii — CPU 100% spin loopissa. Miten synkkaat frame rateen?

## Tilanne

Demo käyttää busy loopia:

```cpp
void GameLoop::run() {
    while (m_running) {
        m_widget->update();
        // ei unta, ei vsync — CPU 100%
    }
}
```

Frame rate on satunnainen tuhansia FPS, CPU-lämpö nousee ja animaatio ei synkkaa näytön kanssa.

## Ratkaisu

`QSurfaceFormat swapInterval 1` (VSync) tai `QTimer ~16ms` — älä busy loop:

```cpp
// Poista spin loop — käytä Qt event loopia

class DemoWidget : public QOpenGLWidget {
public:
    DemoWidget() {
        QSurfaceFormat fmt = format();
        fmt.setSwapInterval(1);
        setFormat(fmt);

        connect(&m_timer, &QTimer::timeout, this, QOverload<>::of(&QWidget::update));
        m_timer.start(16);  // varmuuden vuoksi jos vsync pois
    }

protected:
    void paintGL() override {
        makeCurrent();
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        draw();
        // swap tapahtuu automaattisesti vsyncin mukaisesti
    }

private:
    QTimer m_timer;
};
```

Event loop + vsync antaa CPU:lle hengitystaukoja framejen välillä.

## Käytännössä

Älä koskaan `while`-loop GL-demossa Qt-sovelluksessa — käytä `QTimer`, `QAbstractAnimation` tai pelimoottorin fixed timestep timerilla. `setSwapInterval(1)` `main()`:ssä ennen widgetin show():ia. Benchmarkissa `swapInterval(0)` ok, mutta demo/käyttöliittymässä vsync säästää energiaa.

[Lue lisää](https://doc.qt.io/qt-6/qsurfaceformat.html#setSwapInterval)

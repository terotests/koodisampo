# QOpenGLWidget renderöi vain kerran avauksessa — animaatio jäätyy. Mitä kutsut?

## Tilanne

`paintGL()` ajetaan kerran ikkunan avautuessa. Pyörivä kuutio tai liike pysähtyy — widget ei pyydä uusia frameja. `QOpenGLWidget` piirtää vain kun Qt kutsuu `paintGL()`:ää repaint-pyynnön kautta.

## Ratkaisu

Kutsu `update()` — jatkuvaan animaatioon `QTimer` → `update()`:

```cpp
class AnimatedGLWidget : public QOpenGLWidget {
    Q_OBJECT
public:
    AnimatedGLWidget(QWidget *parent = nullptr)
        : QOpenGLWidget(parent)
    {
        connect(&m_timer, &QTimer::timeout, this, QOverload<>::of(&QWidget::update));
        m_timer.start(16);  // ~60 FPS
    }

protected:
    void paintGL() override {
        makeCurrent();
        m_angle += 0.5f;
        m_shaderProgram.setUniformValue("uAngle", m_angle);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        m_vao.bind();
        glDrawArrays(GL_TRIANGLES, 0, 36);
        m_vao.release();
    }

private:
    QTimer m_timer;
    float m_angle = 0.0f;
};
```

`update()` merkitsee widgetin likaiseksi ja ajaa `paintGL()` seuraavassa event loop -kierroksessa.

## Käytännössä

Interaktiiviseen piirtämiseen riittää `update()` hiiren/k näppäimen tapahtumissa. Animaatioon `QTimer` tai `QElapsedTimer` `paintGL()`:ssä delta-aikaan. Vältä `repaint()` — se blokkaa. Pelissä harkitse vsync (`setSwapInterval(1)`) frame pacingiin timerin sijaan.

[Lue lisää](https://doc.qt.io/qt-6/qopenglwidget.html)

# Depth buffer ei toimi — 3D-objektit piirtyvät väärin. Mitä surface formatissa?

## Tilanne

Olet ottanut `glEnable(GL_DEPTH_TEST)` käyttöön, mutta objektit piirtyvät silti väärässä syvyysjärjestyksessä. `glClear(GL_DEPTH_BUFFER_BIT)` ei vaikuta — syynä on depth bufferin puuttuminen tai nollakoko surface formatissa.

## Ratkaisu

`setDepthBufferSize(24)` — depth buffer koko surface formatissa:

```cpp
int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    QSurfaceFormat fmt;
    fmt.setRenderableType(QSurfaceFormat::OpenGL);
    fmt.setVersion(3, 3);
    fmt.setProfile(QSurfaceFormat::CoreProfile);
    fmt.setDepthBufferSize(24);   // 16/24/32 — 24 on yleinen
    fmt.setStencilBufferSize(8);  // valinnainen stencil-testeihin
    QSurfaceFormat::setDefaultFormat(fmt);

    SceneWindow w;
    w.show();
    return app.exec();
}

void SceneWidget::paintGL() {
    makeCurrent();
    glEnable(GL_DEPTH_TEST);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    // ...
}
```

Ilman riittävää depth buffer -bittejä Z-testi ei toimi luotettavasti.

## Käytännössä

Aseta format ennen GL-widgetin luontia. Tarkista `QSurfaceFormat::defaultFormat().depthBufferSize()` debug-tulosteella — 0 tarkoittaa ongelmaa. macOS Core Profile vaatii depth bufferin eksplisiittisesti. Z-fighting → siirrä near/far-planeja tai käytä `glPolygonOffset`.

[Lue lisää](https://doc.qt.io/qt-6/qsurfaceformat.html#setDepthBufferSize)

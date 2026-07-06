# Qt Quick Controls -napit näyttävät erilaisilta Windowsilla ja macOS:llä. Miten saat natiivin ulkoasun?

## Tilanne

Sovellus käyttää `QtQuick.Controls`-nappeja, mutta tiimi haluaa yhtenäisen teeman kaikilla alustoilla tai päinvastoin natiivin lookin.

## Ratkaisu

Valitse tyyli ennen QML-latausta:

```cpp
#include <QQuickStyle>

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);
    QQuickStyle::setStyle("Fusion");  // tai "Material", "Basic", ...
    QQmlApplicationEngine engine;
    engine.loadFromModule("MyApp", "Main");
    return app.exec();
}
```

Ympäristömuuttuja: `QT_QUICK_CONTROLS_STYLE=Fusion`.

## Käytännössä

`Basic` on kevyt oletus. `Fusion`/`Material`/`Universal` ovat cross-platform-teemoja. Alustakohtainen natiivi tyyli riippuu Qt-versiosta ja alustasta.

[Lue lisää](https://doc.qt.io/qt-6/qtquickcontrols2-styles.html)

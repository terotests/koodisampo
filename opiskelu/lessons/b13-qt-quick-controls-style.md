# Qt Quick Controls -napit näyttävät erilaisilta Windowsilla ja macOS:llä. Miten saat natiivin ulkoasun?

## Tilanne

Sovellus käyttää `QtQuick.Controls`-nappeja, mutta koodissa on pakotettu alustariippumaton tyyli (esim. `Basic` tai `Fusion`), joten napit eivät näytä natiiveilta.

## Ratkaisu

Qt 6:ssa `import QtQuick.Controls` käyttää oletuksena alustan natiivia tyyliä (Windowsilla `Windows`, macOS:llä `macOS`). Poista pakotettu tyyli tai valitse natiivi tyyli ennen QML-latausta:

```cpp
#include <QQuickStyle>

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);
#ifdef Q_OS_MACOS
    QQuickStyle::setStyle("macOS");
#elif defined(Q_OS_WIN)
    QQuickStyle::setStyle("Windows");
#endif
    QQmlApplicationEngine engine;
    engine.loadFromModule("MyApp", "Main");
    return app.exec();
}
```

Ympäristömuuttuja: `QT_QUICK_CONTROLS_STYLE=Windows`.

## Käytännössä

`Basic`, `Fusion`, `Material` ja `Universal` ovat alustariippumattomia teemoja — ne näyttävät samalta kaikkialla, eivät natiiveilta. Natiivit tyylit `macOS` ja `Windows` toimivat vain omalla alustallaan.

[Lue lisää](https://doc.qt.io/qt-6/qtquickcontrols2-styles.html)

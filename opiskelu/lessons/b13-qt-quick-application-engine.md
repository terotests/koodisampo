# Uusi Qt 6 -sovellus lataa QML-tiedoston `main.qml`. Mikä C++-luokka on suositeltu entry point?

## Tilanne

Aloitat uuden Qt 6 -desktop-sovelluksen. `main.cpp` lataa käyttöliittymän tiedostosta `main.qml` eikä käytä QWidgeteja lainkaan.

## Ratkaisu

Käytä `QQmlApplicationEngine`:

```cpp
#include <QGuiApplication>
#include <QQmlApplicationEngine>

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);
    QQmlApplicationEngine engine;
    engine.loadFromModule("MyApp", "Main");
    if (engine.rootObjects().isEmpty())
        return -1;
    return app.exec();
}
```

`QQmlApplicationEngine` lataa QML-moduulin, luo kontekstin ja hallitsee juuriobjektia ilman erillistä `QWindow`-/`QQuickView`-instanssia.

## Käytännössä

`QQuickView` sopii yksinkertaiseen upotukseen, mutta uusissa Qt 6 -sovelluksissa `QQmlApplicationEngine` on oletus. Rekisteröi C++-tyypit ennen `load()`-kutsua.

[Lue lisää](https://doc.qt.io/qt-6/qqmlapplicationengine.html)

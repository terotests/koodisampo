# QML-moduulissa tarvitaan jaettu `Theme`-olio (värit, fontit) ilman useita instansseja. Qt 6 -tapaa?

## Tilanne

Sovelluksen värit ja fonttikoot ovat keskitetysti `Theme`-objektissa. Useat QML-tiedostot importtaavat saman teeman.

## Ratkaisu

QML-singleton:

```qml
// Theme.qml
pragma Singleton
import QtQuick

QtObject {
    readonly property color primary: "#2196F3"
    readonly property int bodySize: 14
}
```

`qmldir`:

```
singleton Theme 1.0 Theme.qml
```

Käyttö:

```qml
import MyApp 1.0
Text { color: Theme.primary; font.pixelSize: Theme.bodySize }
```

C++-vaihtoehto: `QML_SINGLETON` + `QML_ELEMENT`.

## Käytännössä

Singleton takaa yhden instanssin moduulissa. Tavallinen QML-tiedosto luo uuden instanssin jokaista `Component`-luontia kohden.

[Lue lisää](https://doc.qt.io/qt-6/qtqml-typesystem-objecttypes.html)

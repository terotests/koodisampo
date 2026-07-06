# C++-luokka `SensorModel` pitää käyttää QML:ssä `SensorModel { }` -instanssina. Rekisteröinti?

## Tilanne

`SensorModel` perii `QAbstractListModel`:in C++:ssa. QML-lista tarvitsee instanssin deklaratiivisesti.

## Ratkaisu

Qt 6 — rekisteröi tyyppi ennen QML-latausta:

```cpp
#include <QtQml/qqml.h>

QML_ELEMENT  // moduulissa MyApp

// tai manuaalisesti:
qmlRegisterType<SensorModel>("com.app.sensors", 1, 0, "SensorModel");
```

QML:

```qml
import com.app.sensors 1.0
SensorModel { id: sensorModel }
```

## Käytännössä

`QML_ELEMENT` + CMake `qt_add_qml_module` on moderni tapa. `qmlRegisterType` sopii legacy-koodiin. Context property on yksittäiselle globaalille instanssille, ei tyypille.

[Lue lisää](https://doc.qt.io/qt-6/qtqml-cppintegration-definetypes.html)

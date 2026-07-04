# Build epäonnistuu: 'staticMetaObject undefined' luokalle jossa on Q_OBJECT. Puuttuva askel?

## Tilanne

Uusi luokka `DeviceController` sisältää signaalit ja slotit:

```cpp
// devicecontroller.h
class DeviceController : public QObject {
    Q_OBJECT
public:
    explicit DeviceController(QObject *parent = nullptr);
signals:
    void deviceConnected(const QString &id);
public slots:
    void scan();
};
```

CMake-build kaatuu linkkerivaiheessa:

```
undefined reference to `DeviceController::staticMetaObject'
```

Header on lisätty projektiin, mutta MOC ei generoi metakoodia — `Q_OBJECT`-makro vaatii Meta-Object Compiler -vaiheen.

## Ratkaisu

Varmista, että MOC ajetaan headerille — CMake `AUTOMOC` tai qmake `moc`:

```cmake
# CMakeLists.txt
set(CMAKE_AUTOMOC ON)
add_library(devices devicecontroller.h devicecontroller.cpp)
```

tai qmake:

```pro
HEADERS += devicecontroller.h  # moc generoidaan automaattisesti
```

MOC ei ajettu — varmista Q_OBJECT, headers CMake AUTOMOC:ssa tai qmake moc. Meta-Object Compiler generoi `staticMetaObject` — Qt MOC docs.

## Käytännössä

Jos header on vain include-tiedosto ilman vastaavaa `.cpp`:tä, lisää se silti `add_library`-listaan tai käytä `qt6_wrap_cpp()`. Puhdas template-header `.hpp` ilman Q_OBJECT:ia ei tarvitse MOC:ia — älä lisää makroa turhaan.

[Lue lisää](https://doc.qt.io/qt-6/moc.html)

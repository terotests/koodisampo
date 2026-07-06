# QML binding ei toimi odotetusti — haluat nopean lokituksen ilman C++-debuggeria. Ensimmäinen askel?

## Tilanne

Listan `count` näyttää nollaa vaikka mallissa on dataa. Tarvitset nopean tavan nähdä property-arvot.

## Ratkaisu

```qml
Component.onCompleted: {
    console.log("model count:", listModel.count)
    console.warn("backend ready:", backend !== null)
}
```

Tai binding-debug:

```qml
onCountChanged: console.log("count ->", count)
```

Loki näkyy Qt Creatorin **Application Output** -ikkunassa tai terminaalissa.

## Käytännössä

`console.log`, `console.warn`, `console.error` ovat QML:n built-in-debuggaus. Syvempään analyysiin: Qt Creator QML Debugger, `QT_QML_DEBUG=1`, QML Profiler.

[Lue lisää](https://doc.qt.io/qt-6/qtquick-debugging.html)

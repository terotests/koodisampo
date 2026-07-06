# QML:ssä haluat kuunnella C++-backendin signaalia ilman suoraa `onFoo`-handleria eri tiedostossa. Ratkaisu?

## Tilanne

`Backend`-olio on injektoitu kontekstipropertyna. Erillisessä QML-tiedostossa haluat reagoida `dataReady`-signaaliin ilman että backend on suoraan parent-ketjussa.

## Ratkaisu

Käytä `Connections`-elementtiä:

```qml
import QtQml

Connections {
    target: backend
    function onDataReady(payload) {
        listModel.refresh(payload)
    }
}
```

`Connections` kuuntelee `target`-objektin signaaleja riippumatta hierarkiasta.

## Käytännössä

Qt 6:ssa suositellaan funktio-syntaksia (`function onSignalName()`). Vanha `onSignal: handler` toimii edelleen. Varmista että `target` ei ole `null`.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtqml-connections.html)

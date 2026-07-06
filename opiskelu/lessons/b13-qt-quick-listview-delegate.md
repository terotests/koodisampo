# ListView näyttää 10 000 riviä hitaasti — kaikki delegate-instanssit luodaan kerralla. Miten korjaat?

## Tilanne

Tuotantosovelluksessa `Column` + `Repeater` renderöi kymmeniä tuhansia rivejä. Käynnistys kestää sekunteja ja muisti kasvaa.

## Ratkaisu

Korvaa rakenne `ListView`:llä, joka **kierrättää** delegate-komponentteja:

```qml
ListView {
    anchors.fill: parent
    model: myListModel
    delegate: ItemDelegate {
        width: ListView.view.width
        text: model.display
    }
}
```

`ListView` luo vain näkyvien rivien (+ `cacheBuffer`) delegate-instanssit.

## Käytännössä

Pieni kiinteä määrä (< ~20) elementtejä: `Repeater` + `Row`. Pitkät listat: `ListView` tai `GridView` + C++ `QAbstractListModel`.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-listview.html)

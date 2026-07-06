# Haluat piirtää kiinteän 5 tagia vaakasuoraan ilman C++-mallia. Qt Quick -ratkaisu?

## Tilanne

Suodatinpalkissa viisi staattista tagia ("Uusi", "Myyty", …) ilman erillistä dataa backendistä.

## Ratkaisu

```qml
Row {
    spacing: 8
    Repeater {
        model: ["Uusi", "Käsittelyssä", "Valmis", "Arkisto", "Kaikki"]
        delegate: Rectangle {
            radius: 4
            color: "#eee"
            Text { anchors.centerIn: parent; text: modelData; padding: 8 }
        }
    }
}
```

Tai `model: 5` ja `index`-pohjainen delegate.

## Käytännössä

`Repeater` luo kaikki instanssit kerralla — sopii pieneen määrään. Pitkät listat: `ListView`. `Flow` rivittää tagit automaattisesti.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-repeater.html)

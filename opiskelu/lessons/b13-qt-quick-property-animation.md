# Rectangle liikkuu x: 0 → 300 kun `running` muuttuu true. Yksinkertaisin animaatio?

## Tilanne

Indikaattoripalkki liu'utetaan näkyviin kun lataus alkaa. Animaation pitää kestää 400 ms.

## Ratkaisu

```qml
Rectangle {
    id: bar
    x: 0
    height: 4
    PropertyAnimation on x {
        from: 0
        to: 300
        duration: 400
        running: root.running
    }
}
```

`PropertyAnimation` animoi yhden numeropropertyn arvoa ajan funktiona.

## Käytännössä

Usealle propertylle: `NumberAnimation`/`ParallelAnimation`. Jatkuvaan liikkeeseen: `Animation on x` + `loops: Animation.Infinite`. `Behavior on x` animoi jokaisen binding-muutoksen.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-propertyanimation.html)

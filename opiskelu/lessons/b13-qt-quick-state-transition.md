# Painike vaihtaa väriä hover-tilassa animoidusti. Qt Quick -rakenne?

## Tilanne

Custom-painike tarvitsee hover- ja pressed-tilat animoiduilla värisiirtymillä ilman imperatiivista JavaScriptiä.

## Ratkaisu

```qml
Rectangle {
    id: btn
    color: "lightgray"
    states: [
        State {
            name: "hovered"
            when: mouseArea.containsMouse
            PropertyChanges { target: btn; color: "steelblue" }
        }
    ]
    transitions: Transition {
        ColorAnimation { duration: 150 }
    }
    MouseArea { id: mouseArea; anchors.fill: parent; hoverEnabled: true }
}
```

`State` määrittää property-arvot tilanteessa, `Transition` animoi muutoksen.

## Käytännössä

Qt Quick Controls tarjoaa valmiit tilat. Custom-komponenteissa state/transition on selkeä tapa. `Behavior on color` on lyhyempi yksittäiselle propertylle.

[Lue lisää](https://doc.qt.io/qt-6/qtquick-statesanimations-states.html)

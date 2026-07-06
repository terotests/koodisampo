# Mobiilisovelluksessa näkymät pinoutuvat (lista → detail → asetukset) takaisin-navigoinnilla. Qt Quick Controls?

## Tilanne

Android-tyylinen navigointi: lista → tuotetiedot → muokkaus. Takaisin-nappi palaa edelliseen näkymään.

## Ratkaisu

```qml
import QtQuick.Controls

ApplicationWindow {
    StackView {
        id: stack
        anchors.fill: parent
        initialItem: listPage
    }
}

// ListPage.qml — avaa detail:
stack.push("DetailPage.qml", { itemId: model.id })

// DetailPage — takaisin:
stack.pop()
```

`StackView` hallitsee näkymäpinoa ja siirtymäanimaatiot.

## Käytännössä

`push()`/`pop()`/`pop(null)`/`replace()`. `depth` kertoo pinon syvyyden. `SwipeView` on sivuttain pyyhkäisy, ei syvyysnavigaatio.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-controls-stackview.html)

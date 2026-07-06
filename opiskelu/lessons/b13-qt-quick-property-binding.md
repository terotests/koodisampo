# QML:ssä `width: parent.width` ja `onWidthChanged: width = parent.width` aiheuttavat jatkuvaa päivitystä. Mikä on oikea tapa?

## Tilanne

Custom-komponentissa yrität pitää leveyden synkassa parentin kanssa, mutta lisäät samalla `onWidthChanged`-handlerin joka asettaa `width`-propertyn uudelleen. UI alkaa päivittyä loputtomasti.

## Ratkaisu

Käytä **yhtä deklaratiivista bindingia**:

```qml
Item {
    width: parent ? parent.width : implicitWidth
}
```

Poista `onWidthChanged`-sijoitus. Binding päivittyy automaattisesti kun parentin leveys muuttuu.

## Käytännössä

Binding (`property: expression`) on eri asia kuin sijoitus handlerissa (`width = value`), joka **rikkoo** bindingin. Jos tarvitset ohjelmallista palautusta, käytä `Qt.binding()`.

[Lue lisää](https://doc.qt.io/qt-6/qtqml-syntax-propertybinding.html)

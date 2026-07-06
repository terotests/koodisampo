# Käyttäjä muokkaa TextFieldiä — haluat palauttaa automaattisen bindingin `text: model.name` kun focus poistuu. Qt 6?

## Tilanne

Inline-muokkaus: käyttäjä kirjoittaa TextFieldiin, mutta peruutuksessa arvo pitää palauttaa mallin arvoon sidottuna.

## Ratkaisu

```qml
TextField {
    text: model.name
    onEditingFinished: {
        text = Qt.binding(() => model.name)
    }
}
```

Käyttäjän kirjoitus **rikkoo** bindingin (sijoitus). `Qt.binding()` luo uuden bindingin ohjelmallisesti.

## Käytännössä

Tallennuksessa aseta malliin ja palauta binding, tai käytä erillistä `editBuffer`-propertyä. `Binding`-elementti on deklaratiivinen vaihtoehto.

[Lue lisää](https://doc.qt.io/qt-6/qtqml-javascript-hostenvironment.html)

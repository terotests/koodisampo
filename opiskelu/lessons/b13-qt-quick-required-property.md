# Custom `DetailPage`-komponentti vaatii `title`-tekstin — virhe jos parent ei anna sitä. Qt 6 QML?

## Tilanne

Uudelleenkäytettävä sivukomponentti tarvitsee pakollisen otsikon. Unohtunut parametri aiheuttaisi hiljaisen tyhjän UI:n.

## Ratkaisu

```qml
// DetailPage.qml
import QtQuick

Item {
    required property string title

    Text {
        text: title
        font.bold: true
    }
}
```

Parent:

```qml
DetailPage { title: "Tuote A" }
```

Puuttuva `title` antaa QML-varoituksen/virheen latauksessa.

## Käytännössä

Qt 6:ssa `required property` korvaa monia implisiittisiä oletuksia. Useita pakollisia kenttiä: `required property int itemId` jne.

[Lue lisää](https://doc.qt.io/qt-6/qtqml-syntax-objectattributes.html#required-properties)

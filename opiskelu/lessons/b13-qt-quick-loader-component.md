# Haluat ladata raskaan QML-näkymän vasta kun käyttäjä avaa sen. Qt Quick -komponentti?

## Tilanne

Sovelluksen asetussivu on raskas (satoja komponentteja). Et halua rakentaa sitä käynnistyksessä.

## Ratkaisu

Käytä `Loader`-komponenttia:

```qml
Loader {
    id: settingsLoader
    active: stack.currentItem === "settings"
    source: "SettingsPage.qml"
    // tai: sourceComponent: settingsComponent
}
```

`active: false` estää komponentin luonnin. `source`/`sourceComponent` lataa näkymän tarpeen mukaan.

## Käytännössä

`Loader.status` (`Loading`, `Ready`, `Error`) kertoo lataustilan. `asynchronous: true` voi siirtää latauksen taustalle. `StackView.push()` on vaihtoehto navigointipinoon.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-loader.html)

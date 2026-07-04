# on_pushButton_clicked() ei kutsuta — slot nimi väärä. Miten auto-connection löytää slotin?

## Tilanne

Qt Designer -luotu lomake `mainwindow.ui` sisältää napin, jonka `objectName` on `saveButton`. Kehittäjä kirjoittaa slottimetodin:

```cpp
void MainWindow::on_saveBtn_clicked() {  // väärä nimi!
    saveDocument();
}
```

Nappia painettaessa mitään ei tapahdu — ei virhettä, ei lokiviestiä. Kehittäjä olettaa connectin puuttuvan, vaikka `setupUi()` kutsuu `QMetaObject::connectSlotsByName(this)`.

Auto-connection vaatii tarkan nimeämiskaavan.

## Ratkaisu

Noudata Qt Designerin auto-connect -kaavaa `on_<objectName>_<signal>()`:

```cpp
// UI: objectName = "saveButton", signal = clicked
void MainWindow::on_saveButton_clicked() {
    saveDocument();
}
```

`on_<objectName>_<signal>()` — moc auto-connect pattern Designerissä. `connectSlotsByName()` etsii slotit metanimen perusteella — objectName:n on täsmättävä UI-tiedostoon.

## Käytännössä

Tarkista Designerin Object Inspector -näkymästä tarkka `objectName`. Modernissa koodissa monet tiimit suosivat eksplisiittistä `connect()`-kutsua auto-connectionin sijaan — se on selkeämpi refaktoroinnissa.

[Lue lisää](https://doc.qt.io/qt-6/designer-using-a-ui-file.html#automatic-connections)

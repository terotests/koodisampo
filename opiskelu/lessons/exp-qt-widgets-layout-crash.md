# Code review: QDialog luodaan stackissa ilman parenttia ja deleteLater kutsutaan väärässä järjestyksessä — crash suljettaessa. Mitä ehdotat?

## Tilanne

Kollega avaa tiedostonvalitsimen näin:

```cpp
void MainWindow::openFilePicker() {
    QDialog dialog;  // stack-objekti, ei parenttia
    auto *layout = new QVBoxLayout(&dialog);
    auto *list = new QListWidget();  // orphan — ei parenttia
    layout->addWidget(list);

    connect(&dialog, &QDialog::finished, [&]() {
        list->deleteLater();
        dialog.deleteLater();  // stack-objektille — UB
    });

    dialog.exec();
}
```

Suljettaessa ikkunaa sovellus kaatuu satunnaisesti. `deleteLater` stack-objektille on määrittelemätöntä käyttäytymistä, ja `QListWidget` voi elää pidempään kuin dialogi odottaa.

## Ratkaisu

Anna parent `QWidget*`: Qt hallitsee elinkaaren hierarkiassa automaattisesti:

```cpp
void MainWindow::openFilePicker() {
    QDialog dialog(this);  // parent = pääikkuna
    auto *layout = new QVBoxLayout(&dialog);
    auto *list = new QListWidget(&dialog);  // parent = dialog
    layout->addWidget(list);

    dialog.exec();
    // Ei deleteLater-kutsuja — parent-child ownership hoitaa
}
```

Parent-child ownership on Qt Widgets -perusta — doc.qt.io object trees.

## Käytännössä

Älä kutsu `deleteLater()` objekteille, joiden elinkaaren Qt jo hallitsee. Stack-dialogeissa parent on usein `this` (kutsuva ikkuna). Jos dialogi on heapillä, käytä `dialog->setAttribute(Qt::WA_DeleteOnClose)` sen sijaan, että hallitset tuhoamista käsin.

[Lue lisää](https://doc.qt.io/qt-6/objecttrees.html)

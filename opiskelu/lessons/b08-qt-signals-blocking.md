# Lataat modelin UI:hin — jokainen setData laukaisee dataChanged ja hidastaa. Miten hiljennät?

## Tilanne

`QSqlTableModel` täytetään tietokannasta 800 rivillä. Latausloopissa:

```cpp
for (int row = 0; row < records.size(); ++row) {
    model->setData(model->index(row, 0), records[row].id);
    model->setData(model->index(row, 1), records[row].name);
}
```

`QTableView` kuuntelee `dataChanged`-signaalia ja piirtää uudelleen jokaisella kutsulla. Käynnistys kestää 10 sekuntia ja käyttöliittymä näyttää jäätyneeltä.

## Ratkaisu

Hiljennä signaalit batch-päivityksen ajaksi:

```cpp
model->blockSignals(true);
for (int row = 0; row < records.size(); ++row) {
    model->setData(model->index(row, 0), records[row].id);
    model->setData(model->index(row, 1), records[row].name);
}
model->blockSignals(false);
model->layoutChanged();  // ilmoita näkymälle kerralla
```

Tai RAII-tyylillä:

```cpp
QSignalBlocker blocker(model);
// ... bulk setData ...
```

`QSignalBlocker` RAII blocks signals — QObject blockSignals. Palauta `false` batch-päivityksen jälkeen ja ilmoita muutoksesta kerralla.

## Käytännössä

Yli ~50 rivin päivityksissä harkitse `beginResetModel()`/`endResetModel()` tai suoraa SQL-latausta modeliin. `QSignalBlocker` on nopein korjaus ilman arkkitehtuurimuutosta.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#blockSignals)

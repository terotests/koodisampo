# Lataat 1000 riviä modeliin — jokainen setData laukaisee view-päivityksen. Optimointi?

## Tilanne

Raporttinäkymä lataa CSV-exportin suoraan `QStandardItemModel`:iin:

```cpp
void ReportView::importCsv(const QString &path) {
    auto rows = parseCsv(path);  // ~1000 riviä
    for (int i = 0; i < rows.size(); ++i) {
        m_model->setItem(i, 0, new QStandardItem(rows[i].date));
        m_model->setItem(i, 1, new QStandardItem(rows[i].amount));
    }
}
```

`QTableView` reagoi jokaiseen `dataChanged`- ja `rowsInserted`-signaaliin. Import kestää kauan ja ikkuna ei vastaa scrollaukseen.

## Ratkaisu

Hiljennä signaalit bulk-päivityksen ajaksi:

```cpp
void ReportView::importCsv(const QString &path) {
    QSignalBlocker blocker(m_model);
    auto rows = parseCsv(path);
    m_model->setRowCount(rows.size());
    for (int i = 0; i < rows.size(); ++i) {
        m_model->setItem(i, 0, new QStandardItem(rows[i].date));
        m_model->setItem(i, 1, new QStandardItem(rows[i].amount));
    }
}
// blocker vapautuu — yksi layoutChanged riittää
```

`QSignalBlocker` tai `blockSignals(true)` bulk-päivityksen ajaksi. blockSignals/QSignalBlocker — Qt signals batch update.

## Käytännössä

1000+ riville harkitse `beginInsertRows()`/`endInsertRows()` tai lataus suoraan SQL-modeliin. Näytä `QProgressDialog` ja kutsu `QApplication::processEvents()` vain jos et voi siirtää importtia taustasäikeeseen.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#blockSignals)

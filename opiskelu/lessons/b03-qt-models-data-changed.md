# Muutat yhden solun dataa suoraan vektorissa — view ei päivity. Mitä emitoit?

## Tilanne

Custom-malli tallentaa rivit `QVector`-säiliöön. Kehittäjä muuttaa arvoa suoraan:

```cpp
m_rows[row].value = 42;
```

`QTableView` ei reagoi — solu näyttää vanhaa arvoa kunnes koko malli resetataan.

Model/View-arkkitehtuuri vaatii ilmoituksen näkymälle.

## Ratkaisu

Emitoi `dataChanged(topLeft, bottomRight, roles)` muutoksen jälkeen:

```cpp
void InventoryModel::setCellValue(int row, int col, double value) {
    if (row < 0 || row >= m_rows.size())
        return;

    m_rows[row].columns[col] = value;

    const QModelIndex topLeft = index(row, col);
    emit dataChanged(topLeft, topLeft, {Qt::DisplayRole, Qt::EditRole});
}
```

Useamman solun päivitys:

```cpp
void InventoryModel::applyDiscount(int fromRow, int toRow, int col) {
    for (int r = fromRow; r <= toRow; ++r)
        m_rows[r].columns[col] *= 0.9;

    emit dataChanged(index(fromRow, col), index(toRow, col),
                     {Qt::DisplayRole});
}
```

## Käytännössä

Ilman `dataChanged`-signaalia view ei tiedä päivityksestä — vaikka `data()` palauttaisi jo uuden arvon. Ilmoita aina ne roolit, jotka muuttuivat. Bulk-päivityksissä yhdistä yhdeksi `dataChanged`-alueeksi sen sijaan, että emitoit jokaiselle solulle erikseen.

[Lue lisää](https://doc.qt.io/qt-6/qabstractitemmodel.html#dataChanged)

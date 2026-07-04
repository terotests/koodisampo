# Custom model päivittää solun — view ei päivity ennen full reset. Mitä signaalia emit?

## Tilanne

Custom `QAbstractTableModel` päivittää solun arvon taustafunktiossa. `data()` palauttaa uuden arvon, mutta `QTableView` näyttää vanhaa tekstiä kunnes kehittäjä kutsuu `beginResetModel()` / `endResetModel()`.

Kohdennettu ilmoitus puuttuu.

## Ratkaisu

Emitoi `dataChanged(topLeft, bottomRight, roles)` yhden solun päivitykseen:

```cpp
void MetricsModel::updateCell(int row, int col, const QString &value) {
    m_data[row][col] = value;

    const QModelIndex topLeft = index(row, col);
    emit dataChanged(topLeft, topLeft,
                     {Qt::DisplayRole, Qt::ForegroundRole});
}
```

`setData()`-polku:

```cpp
bool MetricsModel::setData(const QModelIndex &index,
                           const QVariant &value,
                           int role) {
    if (!index.isValid())
        return false;

    if (role == Qt::EditRole) {
        m_data[index.row()][index.column()] = value.toString();
        emit dataChanged(index, index, {Qt::DisplayRole, Qt::EditRole});
        return true;
    }
    return false;
}
```

## Käytännössä

Yhdelle solulle `topLeft` ja `bottomRight` ovat sama indeksi. Ilmoita kaikki muuttuneet roolit — esim. jos väri muuttuu, lisää `Qt::ForegroundRole`. Full reset on tarpeeton pelkälle soluarvon vaihdolle ja aiheuttaa turhaa välkkymistä.

[Lue lisää](https://doc.qt.io/qt-6/qabstractitemmodel.html#dataChanged)

# Taulukko välkkyy kun päivität 10 000 riviä — koko model resetataan. Tehokkaampi tapa?

## Tilanne

Taustajärjestelmä puskee 10 000 rivin mittaisia päivityksiä sekunnin välein. Koodi kutsuu `beginResetModel()` / `endResetModel()` joka kerta. `QTableView` tyhjentyy, valinta katoaa ja näkymä välkkyy — vaikka rivien määrä ja sarakkeet eivät muutu, vain solujen arvot.

Täysi reset pakottaa näkymän rakentamaan koko listan uudelleen.

## Ratkaisu

Käytä hienojakoisia ilmoituksia: `dataChanged` solujen päivitykseen, `rowsInserted` / `rowsRemoved` rivimäärän muutoksiin. Reset vain kun mallin rakenne muuttuu perusteellisesti:

```cpp
void SensorTableModel::applyBatchUpdate(const QVector<SensorRow> &updates) {
    for (const SensorRow &row : updates) {
        const int r = row.index;
        m_rows[r] = row;

        const QModelIndex topLeft = index(r, 0);
        const QModelIndex bottomRight = index(r, columnCount() - 1);
        emit dataChanged(topLeft, bottomRight, {Qt::DisplayRole});
    }
}

void SensorTableModel::addNewRows(int count) {
    const int first = m_rows.size();
    const int last = first + count - 1;

    beginInsertRows({}, first, last);
    m_rows.resize(first + count);
    endInsertRows();
}
```

`beginResetModel()` / `endResetModel()` vain kun saraken rakenne, roolit tai koko datamalli vaihtuu:

```cpp
void SensorTableModel::reloadSchema(const QVector<ColumnDef> &columns) {
    beginResetModel();
    m_columns = columns;
    m_rows.clear();
    endResetModel();
}
```

## Käytännössä

Suurissa taulukoissa yhdistä päivitykset: kerää muutokset ja emitoi yksi `dataChanged`-alue kerrallaan sen sijaan, että lähetät 10 000 erillistä signaalia. Jos päivität koko listan kerralla, harkitse `layoutAboutToBeChanged()` / `layoutChanged()` lajittelun jälkeen — mutta pelkkä arvon vaihto ei vaadi resetiä.

[Lue lisää](https://doc.qt.io/qt-6/model-view-programming.html)

# QTableView ei päivity kun muokkaat dataa suoraan taustatallennuksessa. Mitä modelin pitää tehdä?

## Tilanne

Taustasäie lataa uusia arvoja suoraan mallin `QVector`-taustaan. UI-threadin `QTableView` näyttää vanhaa dataa — vaikka `data()`-metodi lukee jo päivitetyn vektorin.

Ongelma: muutos ohittaa model-API:n eikä ilmoita näkymälle.

## Ratkaisu

Kaikki muutokset `setData()`:n kautta ja `dataChanged`-signaali jokaisen muutoksen jälkeen:

```cpp
bool PriceModel::setData(const QModelIndex &index,
                         const QVariant &value,
                         int role) {
    if (!index.isValid() || role != Qt::EditRole)
        return false;

    m_prices[index.row()][index.column()] = value.toDouble();
    emit dataChanged(index, index, {Qt::DisplayRole, Qt::EditRole});
    return true;
}
```

Taustasäie päivittää thread-safe tavalla:

```cpp
void PriceModel::applyBackgroundUpdate(int row, int col, double price) {
    // UI-threadillä — esim. QMetaObject::invokeMethod(..., Qt::QueuedConnection)
    const QModelIndex idx = index(row, col);
    setData(idx, price, Qt::EditRole);
}
```

## Käytännössä

Älä muokkaa taustadataa suoraan ilman signaalia — view ja selection-malli luottavat ilmoituksiin. `setData()` on oikea paikka validoinnille ja signaalille. Suurissa erissä voit kerätä muutokset ja emitoida yhden `dataChanged`-alueen lopuksi.

[Lue lisää](https://doc.qt.io/qt-6/qabstractitemmodel.html)

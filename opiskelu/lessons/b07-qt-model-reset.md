# Lista päivittyy hitaasti kun data muuttuu — koko model resetataan. Parempi tapa?

## Tilanne

Reaaliaikainen lista (esim. sensorilukemat) päivittyy useita kertoja sekunnissa. Joka päivityksellä kutsutaan `beginResetModel()` / `endResetModel()`. Scrollaus hyppii, valinta katoaa ja CPU-käyttö nousee.

Suurin osa päivityksistä koskee olemassa olevia rivejä tai lisää yksittäisiä rivejä.

## Ratkaisu

Käytä granular-signaaleja: `dataChanged` solupäivityksiin, `beginInsertRows` / `endInsertRows` uusille riveille:

```cpp
void SensorListModel::onReadingUpdated(int row, double value) {
    m_readings[row].value = value;
    const QModelIndex idx = index(row, 1);
    emit dataChanged(idx, idx, {Qt::DisplayRole});
}

void SensorListModel::onNewSensor(const Sensor &sensor) {
    const int row = m_readings.size();
    beginInsertRows({}, row, row);
    m_readings.append(sensor);
    endInsertRows();
}

void SensorListModel::onSensorRemoved(int row) {
    beginRemoveRows({}, row, row);
    m_readings.removeAt(row);
    endRemoveRows();
}
```

Reset vain kun koko rakenne vaihtuu:

```cpp
void SensorListModel::reloadFromDatabase() {
    beginResetModel();
    m_readings = loadAll();
    endResetModel();
}
```

## Käytännössä

Valitse signaali muutoksen luonteen mukaan: yksi solu → `dataChanged`, uusi rivi → `insertRows`, poisto → `removeRows`, lajittelu → `layoutChanged`. Täysi reset on viimeinen keino. Suurissa erissä voit tilapäisesti `blockSignals(true)` ja emitoida yhden laajan `dataChanged`-alueen.

[Lue lisää](https://doc.qt.io/qt-6/qabstractitemmodel.html)

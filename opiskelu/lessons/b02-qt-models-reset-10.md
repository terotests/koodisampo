# Koko malli vaihtuu — käytät beginResetModel/endResetModel. Milloin riittää dataChanged?

## Tilanne

Custom `QAbstractTableModel` päivittää rivejä. Kehittäjä kutsuu `beginResetModel()` / `endResetModel()` joka kerta kun yksikin solu muuttuu. Näkymä välkkyy, valinta katoaa ja suorituskyky on heikko — vaikka rivien määrä pysyy samana.

Reset on raskain ilmoitus; sitä ei tarvita pelkkään datan päivitykseen.

## Ratkaisu

`dataChanged` riittää kun rivien/sarakkeiden rakenne ei muutu:

```cpp
bool TaskModel::setData(const QModelIndex &index,
                        const QVariant &value,
                        int role) {
    if (!index.isValid() || role != Qt::EditRole)
        return false;

    m_tasks[index.row()].title = value.toString();
    emit dataChanged(index, index, {Qt::DisplayRole, Qt::EditRole});
    return true;
}

void TaskModel::updateStatus(int row, Status status) {
    m_tasks[row].status = status;
    const QModelIndex idx = index(row, 2);
    emit dataChanged(idx, idx, {Qt::DisplayRole});
}
```

Reset vain rakenteen muutoksessa:

```cpp
void TaskModel::replaceAll(const QVector<Task> &tasks) {
    beginResetModel();
    m_tasks = tasks;
    endResetModel();
}

void TaskModel::insertTask(int row, const Task &task) {
    beginInsertRows({}, row, row);
    m_tasks.insert(row, task);
    endInsertRows();
}
```

## Käytännössä

Muista ilmoittaa oikeat roolit `dataChanged`-kutsussa — view piirtää vain muuttuneet roolit uudelleen. Jos päivität monta solua, anna `topLeft` ja `bottomRight` rajaten suorakulmion. Täysi reset on ok vain kun et voi incremental-signaaleilla kuvata muutosta (esim. sarakerakenne vaihtuu).

[Lue lisää](https://doc.qt.io/qt-6/model-view-programming.html)

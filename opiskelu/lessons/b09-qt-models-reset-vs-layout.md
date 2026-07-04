# Lataat koko listan uudelleen — beginResetModel on raskas ja välkkyy. Parempi vaihtoehto?

## Tilanne

Sovellus lataa listan palvelimelta minuutin välein. Joka latauksella kutsutaan `beginResetModel()` / `endResetModel()` vaikka suurin osa riveistä on samoja — vain muutama rivi lisätään tai muuttuu. Näkymä välkkyy ja scroll-asema palaa alkuun.

Täysi reset on liian raskas inkrementaaliseen päivitykseen.

## Ratkaisu

Vertaa vanha ja uusi data; käytä inkrementaalisia signaaleja:

```cpp
void TaskModel::syncFromServer(const QVector<Task> &incoming) {
    // Poistetut rivit
    for (int row = m_tasks.size() - 1; row >= 0; --row) {
        if (!incoming.contains(m_tasks[row].id)) {
            beginRemoveRows({}, row, row);
            m_tasks.removeAt(row);
            endRemoveRows();
        }
    }

    // Uudet ja päivitetyt rivit
    for (int i = 0; i < incoming.size(); ++i) {
        const Task &t = incoming[i];
        const int existing = findRowById(t.id);

        if (existing < 0) {
            beginInsertRows({}, i, i);
            m_tasks.insert(i, t);
            endInsertRows();
        } else if (m_tasks[existing] != t) {
            m_tasks[existing] = t;
            emit dataChanged(index(existing, 0),
                             index(existing, columnCount() - 1));
        }
    }
}
```

Jos rakenne pysyy samana mutta lajittelu muuttuu:

```cpp
void TaskModel::resort() {
    layoutAboutToBeChanged();
    std::sort(m_tasks.begin(), m_tasks.end());
    layoutChanged();
}
```

## Käytännössä

`beginResetModel()` on ok kun et voi diffata (ensimmäinen lataus, täysin eri skeema). Muuten `insertRows`, `removeRows` ja `dataChanged` säilyttävät valinnan ja scroll-aseman. `layoutChanged` sopii pelkkään uudelleenjärjestykseen ilman rivimäärän muutosta.

[Lue lisää](https://doc.qt.io/qt-6/qabstractitemmodel.html#beginResetModel)

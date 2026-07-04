# Bulk-päivitys laukaisee satoja valueChanged-signaaleja — UI jäätyy. Miten hiljennät signaalit väliaikaisesti?

## Tilanne

Taulukkonäkymässä tuodaan CSV-tiedosto 500 rivillä. Jokainen rivi päivittää `QStandardItemModel`:in:

```cpp
for (const Row &row : rows) {
    model->setData(model->index(i, 0), row.name);
    model->setData(model->index(i, 1), row.value);
    ++i;
}
```

Jokainen `setData` laukaisee `dataChanged`-signaalin, joka aiheuttaa `QTableView`:n uudelleenpiirron. UI jäätyy sekunneiksi ja scroll bar -päivitykset näkyvät hidastettuna.

## Ratkaisu

Käytä `QSignalBlocker` tai `blockSignals(true/false)` bulk-päivityksen ajaksi:

```cpp
{
    QSignalBlocker blocker(model);
    for (const Row &row : rows) {
        model->setData(model->index(i, 0), row.name);
        model->setData(model->index(i, 1), row.value);
        ++i;
    }
}  // yksi dataChanged tai layoutChanged importin jälkeen
model->layoutChanged();  // tarvittaessa ilmoita koko muutoksesta
```

`blockSignals`/`QSignalBlocker` estää reentrant päivitykset — Qt docs QSignalBlocker. Yksi ilmoitus importin jälkeen on tehokkaampi kuin satoja välioireita.

## Käytännössä

Suurissa malleissa harkitse `beginResetModel()` / `endResetModel()` tai `beginInsertRows()` -sarjaa. `QSignalBlocker` on nopein korjaus olemassa olevaan loopiin ilman model-rakenteen muutosta.

[Lue lisää](https://doc.qt.io/qt-6/qsignalblocker.html)

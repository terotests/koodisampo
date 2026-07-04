# QTableView sorttaus rikkoo custom modelin indeksit. Ratkaisu?

## Tilanne

Custom `QAbstractTableModel` tallentaa valittuja rivejä `QModelIndex`-listaan. Kun käyttäjä lajittelee `QTableView`:ssä, indeksit osoittavat vääriin riveihin tai muuttuvat invalidiksi. Mallin sisäinen `QVector`-järjestys ei vastaa näkymän järjestystä.

View-tason lajittelu sekoittaa indeksiviitteet.

## Ratkaisu

Siirrä lajittelu `QSortFilterProxyModel`:iin — view näkee proxyn, source-malli pysyy vakiona:

```cpp
TaskModel *source = new TaskModel(this);

auto *proxy = new QSortFilterProxyModel(this);
proxy->setSourceModel(source);
proxy->setSortCaseSensitivity(Qt::CaseInsensitive);

QTableView *view = new QTableView;
view->setModel(proxy);
view->setSortingEnabled(true);
```

Indeksien kartoitus:

```cpp
void onRowActivated(const QModelIndex &proxyIndex) {
    const QModelIndex sourceIndex = proxy->mapToSource(proxyIndex);
    const int taskId = sourceIndex.data(Qt::UserRole).toInt();
    openTask(taskId);
}

void selectById(int taskId) {
    for (int row = 0; row < source->rowCount(); ++row) {
        if (source->index(row, 0).data(Qt::UserRole).toInt() == taskId) {
            const QModelIndex proxyIdx = proxy->mapFromSource(source->index(row, 0));
            view->selectRow(proxyIdx.row());
            break;
        }
    }
}
```

## Käytännössä

Source-mallin rivit pysyvät alkuperäisessä järjestyksessä — indeksit ovat stabiileja. Proxy hoitaa näkymän lajittelun. Tallenna aina domain-id tai käytä `mapToSource()` / `mapFromSource()` kun siirryt proxyn ja source-mallin välillä.

[Lue lisää](https://doc.qt.io/qt-6/qsortfilterproxymodel.html)

# QTableView näyttää kaikki 100k riviä — UI jumittaa. Nopea suodatus ilman uutta modelia?

## Tilanne

Lokitaulukossa on 100 000 riviä. Käyttäjä kirjoittaa hakukenttään ja haluaa nähdä vain osan riveistä. Kopioimalla datan uuteen malliin tuhlaat muistia ja hidastat päivityksiä.

Tarvitaan suodatus ilman datan duplikaatiota.

## Ratkaisu

Aseta `QSortFilterProxyModel` source-mallin ja näkymän väliin:

```cpp
LogTableModel *source = new LogTableModel(this);

auto *proxy = new QSortFilterProxyModel(this);
proxy->setSourceModel(source);
proxy->setFilterCaseSensitivity(Qt::CaseInsensitive);
proxy->setFilterKeyColumn(1);  // viestisarake

QTableView *view = new QTableView;
view->setModel(proxy);

connect(searchField, &QLineEdit::textChanged, proxy,
        &QSortFilterProxyModel::setFilterFixedString);
```

Custom-suodatus aktiivisille riveille:

```cpp
class ActiveOnlyProxy : public QSortFilterProxyModel {
protected:
    bool filterAcceptsRow(int row, const QModelIndex &parent) const override {
        const QModelIndex idx = sourceModel()->index(row, 0, parent);
        return idx.data(Qt::UserRole + 1).toBool();  // active-flag
    }
};
```

## Käytännössä

Proxy ei kopioi dataa — se näyttää source-mallin rivien osajoukon. Live-hakuun käytä `setFilterRegularExpression` tai `setFilterRole`. Muista: valinta ja indeksit viittaavat proxy-malliin; source-indeksiin pääset `mapToSource()`.

[Lue lisää](https://doc.qt.io/qt-6/qsortfilterproxymodel.html)

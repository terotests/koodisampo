# QTableView tarvitsee suodatuksen ja lajittelun ilman datan duplikaatiota. Ratkaisu?

## Tilanne

Asiakasrekisterissä tarvitaan sekä sarakeotsikon lajittelu että tekstihaku. Kehittäjä harkitsee erillistä suodatettua `QVector`-kopiota, jota päivitetään aina kun lähdedata muuttuu — kaksinkertainen muistinkäyttö ja synkronointivirheet.

Model/View tarjoaa proxy-kerroksen tähän.

## Ratkaisu

`QSortFilterProxyModel` source modelin päällä hoitaa suodatuksen ja lajittelun:

```cpp
CustomerModel *source = new CustomerModel(this);

auto *proxy = new QSortFilterProxyModel(this);
proxy->setSourceModel(source);
proxy->setSortCaseSensitivity(Qt::CaseInsensitive);
proxy->setDynamicSortFilter(true);

QTableView *view = new QTableView;
view->setModel(proxy);
view->setSortingEnabled(true);

connect(filterEdit, &QLineEdit::textChanged,
        proxy, &QSortFilterProxyModel::setFilterFixedString);
```

Proxy ei kopioi rivejä — se näyttää source-mallin indeksien kautta:

```cpp
void openSelectedCustomer(const QModelIndex &proxyIndex) {
    const QModelIndex sourceIndex = proxy->mapToSource(proxyIndex);
    const int customerId = sourceIndex.data(Qt::UserRole).toInt();
    showCustomer(customerId);
}
```

## Käytännössä

Yksi proxy riittää sekä suodatukseen että lajitteluun. `setDynamicSortFilter(true)` pitää lajittelun ajan tasalla suodatuksen muuttuessa. Monimutkaisempaan logiikkaan periyty `QSortFilterProxyModel` ja ylikirjoita `filterAcceptsRow()`.

[Lue lisää](https://doc.qt.io/qt-6/qsortfilterproxymodel.html)

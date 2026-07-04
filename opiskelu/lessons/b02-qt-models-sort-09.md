# QTableView sorttaus hidastuu 100k rivillä — sorttaus viewissä. Parempi?

## Tilanne

`QTableView` näyttää 100 000 riviä. Käyttäjä klikkaa sarakeotsikkoa ja lajittelu kestää sekunteja — UI jäätyy. Oletuslajittelu tapahtuu näkymässä, joka vertailee jokaista solua `data()`-kutsulla ilman optimointia.

Suurissa dataseteissä view-tason lajittelu ei skaalaudu.

## Ratkaisu

Siirrä lajittelu proxy-malliin tai datalähteeseen (SQL, indeksoitu vektori):

```cpp
QSqlTableModel *source = new QSqlTableModel(this);
source->setTable("products");
source->setSort(2, Qt::AscendingOrder);  // ORDER BY sarake 2
source->select();

auto *proxy = new QSortFilterProxyModel(this);
proxy->setSourceModel(source);

QTableView *view = new QTableView;
view->setModel(proxy);
view->setSortingEnabled(true);
```

Custom-mallissa lajittele data kerran ja emitoi `layoutChanged`:

```cpp
void ProductModel::sortByName(Qt::SortOrder order) {
    layoutAboutToBeChanged();
    std::sort(m_rows.begin(), m_rows.end(),
              [order](const Row &a, const Row &b) {
                  return order == Qt::AscendingOrder
                      ? a.name < b.name : a.name > b.name;
              });
    layoutChanged();
}
```

## Käytännössä

100k rivillä SQL-tason `ORDER BY` indeksoidulla sarakkeella on nopein. `QSortFilterProxyModel` cachettaa lajittelun ja toimii hyvin kun source-malli on muistissa mutta haluat lajittelun erillään viewistä. Poista view-lajittelu (`setSortingEnabled(false)`) jos käytät SQL-sorttia.

[Lue lisää](https://doc.qt.io/qt-6/qsortfilterproxymodel.html)

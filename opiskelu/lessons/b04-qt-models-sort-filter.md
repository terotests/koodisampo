# QTableView tarvitsee live-haun suodatuksen ilman erillistä kopiomallia. Qt-luokka?

## Tilanne

Tuoteluettelossa on kymmeniä tuhansia rivejä. Hakukenttä suodattaa listaa reaaliajassa jokaisella näppäinpainalluksella. Erillinen kopio-malli vie muistia ja vaatii synkronoinnin aina kun lähdedata muuttuu.

Tarvitaan kevyt suodatuskerros.

## Ratkaisu

`QSortFilterProxyModel` source-mallin päällä:

```cpp
ProductModel *source = new ProductModel(this);

auto *filter = new QSortFilterProxyModel(this);
filter->setSourceModel(source);
filter->setFilterCaseSensitivity(Qt::CaseInsensitive);
filter->setFilterKeyColumn(-1);  // kaikki sarakkeet

QTableView *view = new QTableView;
view->setModel(filter);

connect(searchBox, &QLineEdit::textChanged,
        filter, &QSortFilterProxyModel::setFilterFixedString);
```

Regex-pohjainen live-haku:

```cpp
connect(searchBox, &QLineEdit::textChanged, this, [filter](const QString &text) {
    filter->setFilterRegularExpression(
        QRegularExpression(text, QRegularExpression::CaseInsensitiveOption));
});
```

## Käytännössä

Proxy käärii olemassa olevan mallin — data pysyy yhdessä paikassa. Source-malli voi päivittyä normaalisti; proxy suodattaa automaattisesti. `mapToSource()` tarvitaan kun tallennat valitun rivin id:n tai avaat detail-näkymän.

[Lue lisää](https://doc.qt.io/qt-6/qsortfilterproxymodel.html)

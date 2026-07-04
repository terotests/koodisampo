# QTableView näyttää dataa mutta sortaus ei toimi. Mitä puuttuu?

## Tilanne

`QTableView` näyttää custom-mallin datan oikein, mutta sarakeotsikon klikkaus ei lajittele rivejä. Otsikot eivät näytä nuolia eikä järjestys muutu.

Lajittelu vaatii sekä näkymän että mallin yhteistyötä.

## Ratkaisu

Ota lajittelu käyttöön näkymässä ja varmista, että malli palauttaa sortattavaa dataa `Qt::DisplayRole`:lla:

```cpp
QTableView *view = new QTableView;
view->setModel(model);
view->setSortingEnabled(true);
```

Custom-mallissa `data()` palauttaa vertailukelpoisen arvon:

```cpp
QVariant EmployeeModel::data(const QModelIndex &index, int role) const {
    if (!index.isValid())
        return {};

    const Employee &e = m_employees[index.row()];

    if (role == Qt::DisplayRole) {
        switch (index.column()) {
        case 0: return e.name;
        case 1: return e.salary;      // double — numeerinen lajittelu
        case 2: return e.hireDate;    // QDate
        }
    }
    return {};
}
```

Proxy-malli lajitteluun custom-logiikalla:

```cpp
auto *proxy = new QSortFilterProxyModel(this);
proxy->setSourceModel(model);
view->setModel(proxy);
view->setSortingEnabled(true);
```

## Käytännössä

`setSortingEnabled(true)` on pakollinen viewissä. Mallin `data()` palauttaa `QVariant`-tyypin, jota Qt osaa vertailla (QString, int, double, QDate). Monimutkaisessa lajittelussa ylikirjoita proxy-mallin `lessThan()` tai lajittele source-tasolla ja emitoi `layoutChanged`.

[Lue lisää](https://doc.qt.io/qt-6/model-view-programming.html)

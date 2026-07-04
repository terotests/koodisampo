# QTableView suodatus — haluat näyttää vain aktiiviset rivit ilman datan poistoa. Proxy?

## Tilanne

Käyttäjähallinnassa on sekä aktiivisia että deaktivoituja tilejä. Checkbox "Näytä vain aktiiviset" suodattaa listan, mutta deaktivoidut rivit pitää säilyttää datassa — poistaminen vektorista rikkoo id-viitteet.

Suodatus ilman datan muokkausta.

## Ratkaisu

`QSortFilterProxyModel` `filterAcceptsRow()`:lla:

```cpp
class ActiveUserProxy : public QSortFilterProxyModel {
    Q_OBJECT
public:
    void setShowActiveOnly(bool enabled) {
        m_activeOnly = enabled;
        invalidateFilter();
    }

protected:
    bool filterAcceptsRow(int sourceRow,
                          const QModelIndex &sourceParent) const override {
        if (!m_activeOnly)
            return true;

        const QModelIndex idx =
            sourceModel()->index(sourceRow, 0, sourceParent);
        return idx.data(Qt::UserRole + 1).toBool();  // isActive
    }

private:
    bool m_activeOnly = false;
};
```

Käyttöönotto:

```cpp
UserModel *source = new UserModel(this);
auto *proxy = new ActiveUserProxy(this);
proxy->setSourceModel(source);

QTableView *view = new QTableView;
view->setModel(proxy);

connect(activeCheckBox, &QCheckBox::toggled,
        proxy, &ActiveUserProxy::setShowActiveOnly);
```

## Käytännössä

Source-malli säilyttää kaikki rivit; proxy piilottaa osan näkymästä. `invalidateFilter()` pakottaa uudelleensuodatuksen kun ehto muuttuu. Muista `mapToSource()` kun tallennat valitun käyttäjän id:n tai avaat muokkausdialogin.

[Lue lisää](https://doc.qt.io/qt-6/qsortfilterproxymodel.html)

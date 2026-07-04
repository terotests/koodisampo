# List widget tarvitsee right-click menu. Miten toteutat Qt-widgetsissa?

## Tilanne

Tiedostolistassa (`QListWidget`) käyttäjän pitää pystyä poistamaan, nimeämään uudelleen ja avaamaan tiedoston kontekstivalikosta. Nappirivi jokaiselle riville olisi kömpelö.

```cpp
auto *list = new QListWidget(this);
// Oikea klikkaus ei tee mitään
```

## Ratkaisu

`customContextMenuRequested` + `QMenu` — standard pattern list widgetissä:

```cpp
list->setContextMenuPolicy(Qt::CustomContextMenu);

connect(list, &QWidget::customContextMenuRequested,
        this, [this, list](const QPoint &pos) {
    QModelIndex index = list->indexAt(pos);
    if (!index.isValid())
        return;

    QMenu menu;
    menu.addAction("Avaa", [this, index]() { openFile(index); });
    menu.addAction("Nimeä uudelleen", [this, index]() { renameFile(index); });
    menu.addSeparator();
    menu.addAction("Poista", [this, index]() { deleteFile(index); });

    menu.exec(list->viewport()->mapToGlobal(pos));
});
```

Context menu policy — Qt docs QWidget context menu.

## Käytännössä

`mapToGlobal` on pakollinen — `pos` on viewport-koordinaateissa. Disabloi toiminnot, jos `index.isValid()` on false tai rivi on tyhjä. `QListView`:ssä sama pattern toimii — `Qt::DefaultContextMenu` riittää yksinkertaisiin tapauksiin, mutta custom antaa täyden kontrollin.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#contextMenuPolicy-prop)

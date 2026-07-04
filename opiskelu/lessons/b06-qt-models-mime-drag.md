# Tree view drag-drop eri sovellukseen — data ei siirry. Mitä model-metodia toteutat?

## Tilanne

`QTreeView` tukee sisäistä drag-dropia, mutta kun käyttäjä vetää solun toiseen sovellukseen, pudotus epäonnistuu tai siirtyy tyhjä data. Oletusmalli ei luo MIME-dataa ulkoista siirtoa varten.

Ulkoiseen drag-dropiin tarvitaan mallin MIME-toteutus.

## Ratkaisu

Toteuta `mimeData()` ja `supportedDropActions()` (sekä tarvittaessa `dropMimeData()`):

```cpp
Qt::DropActions FileTreeModel::supportedDropActions() const {
    return Qt::CopyAction | Qt::MoveAction;
}

QStringList FileTreeModel::mimeTypes() const {
    return {QStringLiteral("application/x-filetree-path")};
}

QMimeData *FileTreeModel::mimeData(const QModelIndexList &indexes) const {
    auto *mime = new QMimeData;
    QStringList paths;

    for (const QModelIndex &idx : indexes) {
        if (idx.column() != 0)
            continue;
        paths << idx.data(Qt::UserRole).toString();
    }

    mime->setData("application/x-filetree-path",
                  paths.join('\n').toUtf8());
    mime->setText(paths.join('\n'));  // ulkoiset sovellukset lukevat text/plain
    return mime;
}
```

Pudotus malliin:

```cpp
bool FileTreeModel::dropMimeData(const QMimeData *data,
                                 Qt::DropAction action,
                                 int row, int column,
                                 const QModelIndex &parent) {
    if (!data->hasFormat("application/x-filetree-path"))
        return false;

    const QStringList paths =
        QString::fromUtf8(data->data("application/x-filetree-path")).split('\n');
    for (const QString &path : paths)
        insertFile(parent, row++, path);
    return true;
}
```

View-asetukset:

```cpp
treeView->setDragEnabled(true);
treeView->setAcceptDrops(true);
treeView->setDropIndicatorShown(true);
treeView->setDragDropMode(QAbstractItemView::DragDrop);
```

## Käytännössä

Ota `mimeTypes()` käyttöön ja rekisteröi custom MIME-tyypit. Ulkoisiin sovelluksiin lisää `setText()` tai `setUrls()` standardimuodoilla. `flags()`-metodissa palauta `Qt::ItemIsDragEnabled | Qt::ItemIsDropEnabled` riveille, joita haluat siirtää.

[Lue lisää](https://doc.qt.io/qt-6/model-view-programming.html#using-drag-and-drop-with-item-views)

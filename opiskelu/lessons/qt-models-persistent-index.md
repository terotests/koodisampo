# Taulukkomalli päivittyy (lajittelu/suodatus). Miten tallennat rivin tunnisteen turvallisesti?

## Tilanne

Sovelluksessa on `QTableView`, jossa käyttäjä valitsee rivin ja avaa yksityiskohtanäkymän. Taustalla malli lajittelee tai suodattaa rivejä — esimerkiksi `QSortFilterProxyModel` muuttaa rivien järjestystä. Tallennettu `QModelIndex` osoittaa väärään riviin tai on invalidi.

`QModelIndex` on kevyt kahva: se sidotaan mallin nykyiseen tilaan eikä elä lajittelun, suodatuksen tai rivien lisäyksen yli.

## Ratkaisu

Käytä `QPersistentModelIndex` tai tallenna domain-tason tunniste (esim. `id`-kenttä) rivin datassa:

```cpp
class DetailController : public QObject {
    Q_OBJECT
public:
    void openRow(const QModelIndex &index) {
        // Pysyvä indeksi selviää lajittelusta ja suodatuksesta
        m_selected = QPersistentModelIndex(index);
    }

    void refreshAfterSort() {
        if (!m_selected.isValid())
            return;

        // Hae sama rivi uudelleen pysyvän indeksin kautta
        const QModelIndex current = m_selected;
        const int rowId = current.data(Qt::UserRole).toInt();
        showDetailsForId(rowId);
    }

private:
    QPersistentModelIndex m_selected;
};
```

Vaihtoehto: älä luota indeksiin ollenkaan, vaan tallenna `UserRole`-kenttään oleva id:

```cpp
void saveSelection(const QModelIndex &index) {
    m_savedId = index.data(Qt::UserRole).toInt();
}

QModelIndex findById(QAbstractItemModel *model, int id) const {
    for (int row = 0; row < model->rowCount(); ++row) {
        const QModelIndex idx = model->index(row, 0);
        if (idx.data(Qt::UserRole).toInt() == id)
            return idx;
    }
    return {};
}
```

## Käytännössä

Valitse strategia käyttötapauksen mukaan: `QPersistentModelIndex` riittää, kun haluat viitata samaan malliriviin lajittelun jälkeen. Domain-id on parempi, jos data ladataan uudelleen palvelimelta tai malli resetataan kokonaan. Proxy-mallissa mapataan source-indeksi tarvittaessa `mapToSource()` / `mapFromSource()`.

[Lue lisää](https://doc.qt.io/qt-6/qpersistentmodelindex.html)

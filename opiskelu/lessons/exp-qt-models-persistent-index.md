# Delegate tallentaa QModelIndexin myöhempää käyttöä varten — data väärää insertRow:n jälkeen. Mikä sääntö?

## Tilanne

Custom `QStyledItemDelegate` tallentaa `QModelIndex`-jäsenmuuttujan editorin avaamisen yhteydessä. Käyttäjä muokkaa solua, taustalla tulee uusi rivi `insertRow()`:lla, ja delegate lukee vanhasta indeksistä — solu näyttää väärää dataa tai kaatuu.

Mallin muutokset invalidoivat tavalliset `QModelIndex`-kahvat.

## Ratkaisu

Sääntö: `QModelIndex` ei ole pysyvä insertRow:n, removeRow:n tai resetin jälkeen. Käytä `QPersistentModelIndex` tai hae data uudelleen signaalin yhteydessä:

```cpp
class IdCellDelegate : public QStyledItemDelegate {
public:
    QWidget *createEditor(QWidget *parent,
                          const QStyleOptionViewItem &option,
                          const QModelIndex &index) const override {
        auto *editor = new QLineEdit(parent);
        // Älä tallenna QModelIndexiä — käytä pysyvää versiota
        editor->setProperty("persistentIndex",
                            QVariant::fromValue(QPersistentModelIndex(index)));
        return editor;
    }

    void setModelData(QWidget *editor,
                      QAbstractItemModel *model,
                      const QModelIndex &index) const override {
        const auto *lineEdit = qobject_cast<QLineEdit *>(editor);
        model->setData(index, lineEdit->text(), Qt::EditRole);
    }
};
```

Delegate ei saa pitää raakaa `QModelIndex`iä pitkään — parametri on voimassa vain callbackin ajan:

```cpp
// VÄÄRIN — index voi invalidoitua ennen myöhempää käyttöä
void onEditFinished() {
    const QString text = m_model->data(m_savedIndex).toString();
}

// OIKEIN
void onEditFinished() {
    if (!m_persistent.isValid())
        return;
    const QString text = m_model->data(m_persistent).toString();
}
```

## Käytännössä

Delegate-metodit (`paint`, `createEditor`, `setModelData`) saavat aina tuoreen indeksin parametrina — käytä sitä suoraan. Jos tarvitset viitteen myöhempään (esim. async-validointi), tallenna `QPersistentModelIndex` tai domain-id. Kuuntele `rowsAboutToBeInserted` ja tyhjennä vanhentuneet viitteet.

[Lue lisää](https://doc.qt.io/qt-6/qpersistentmodelindex.html)

# Taulukon solu tarvitsee custom editor widgetin editissä. Mitä käytät?

## Tilanne

Taulukossa on solu, joka vaatii muokkauksessa esimerkiksi `QComboBox`in tai `QDateEdit`:in — tavallinen tekstikenttä ei riitä. Oletuseditori (`QLineEdit`) avautuu, mutta käyttökokemus on väärä.

Tarvitaan custom editor widget.

## Ratkaisu

Periy `QStyledItemDelegate` ja toteuta `createEditor`, `setEditorData`, `setModelData`:

```cpp
class StatusDelegate : public QStyledItemDelegate {
public:
    QWidget *createEditor(QWidget *parent,
                          const QStyleOptionViewItem &,
                          const QModelIndex &) const override {
        auto *combo = new QComboBox(parent);
        combo->addItems({"Avoin", "Kesken", "Valmis"});
        return combo;
    }

    void setEditorData(QWidget *editor,
                       const QModelIndex &index) const override {
        auto *combo = qobject_cast<QComboBox *>(editor);
        combo->setCurrentText(index.data(Qt::EditRole).toString());
    }

    void setModelData(QWidget *editor,
                      QAbstractItemModel *model,
                      const QModelIndex &index) const override {
        auto *combo = qobject_cast<QComboBox *>(editor);
        model->setData(index, combo->currentText(), Qt::EditRole);
    }

    void updateEditorGeometry(QWidget *editor,
                              const QStyleOptionViewItem &option,
                              const QModelIndex &) const override {
        editor->setGeometry(option.rect);
    }
};
```

Käyttöönotto:

```cpp
tableView->setItemDelegateForColumn(3, new StatusDelegate(tableView));
```

## Käytännössä

`createEditor` luo widgetin, `setEditorData` täyttää sen nykyisellä arvolla, `setModelData` kirjoittaa muutoksen takaisin malliin (`setData` → `dataChanged`). Commit tapahtuu automaattisesti kun editor sulkeutuu. `QItemDelegate`-periytys toimii vanhoissa projekteissa, mutta `QStyledItemDelegate` noudattaa teemaa paremmin.

[Lue lisää](https://doc.qt.io/qt-6/qstyleditemdelegate.html)

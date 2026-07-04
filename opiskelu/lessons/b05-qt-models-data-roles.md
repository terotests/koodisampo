# Custom delegate tarvitsee tooltip-datan eri kuin display. Mistä se tulee?

## Tilanne

Taulukon solu näyttää lyhyen otsikon (`DisplayRole`), mutta custom delegate haluaa näyttää pitkän kuvauksen tooltipissa hover-tilassa. Kehittäjä yrittää lukea tooltip-tekstiä `DisplayRole`:sta — tooltip näyttää saman lyhyen tekstin.

Eri näyttötarkoitukset vaativat eri rooleja.

## Ratkaisu

Palauta tooltip `data()`-metodista `Qt::ToolTipRole`:lla (tai custom-roolilla):

```cpp
QVariant ProductModel::data(const QModelIndex &index, int role) const {
    if (!index.isValid())
        return {};

    const Product &p = m_products[index.row()];

    switch (role) {
    case Qt::DisplayRole:
        return p.shortName;
    case Qt::ToolTipRole:
        return QString("%1\nHinta: %2 €\nVarasto: %3")
            .arg(p.description)
            .arg(p.price)
            .arg(p.stock);
    case Qt::EditRole:
        return p.shortName;
    default:
        return {};
    }
}
```

Delegate voi lukea tooltip-roolin suoraan:

```cpp
void RichDelegate::paint(QPainter *painter,
                         const QStyleOptionViewItem &option,
                         const QModelIndex &index) const {
    QStyledItemDelegate::paint(painter, option, index);

    const QString tip = index.data(Qt::ToolTipRole).toString();
    if (!tip.isEmpty() && option.state & QStyle::State_MouseOver)
        QToolTip::showText(QCursor::pos(), tip);
}
```

Custom-rooli monimutkaisemmalle datalle:

```cpp
enum Roles { DescriptionRole = Qt::UserRole + 1 };

// data(): case DescriptionRole: return p.fullDescription;
```

## Käytännössä

Qt tarjoaa valmiit roolit: `DisplayRole`, `EditRole`, `ToolTipRole`, `DecorationRole`, `BackgroundRole`. Käytä niitä ennen custom-rooleja. View välittää tooltip-roolin automaattisesti jos et ylikirjoita sitä delegatessa.

[Lue lisää](https://doc.qt.io/qt-6/qt.html#ItemDataRole-enum)

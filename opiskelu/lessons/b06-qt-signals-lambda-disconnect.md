# Lambda-connect jää eloon widgetin tuhoutumisen jälkeen — crash. Miten disconnect turvallisesti?

## Tilanne

Listanäkymä luo väliaikaisen napin ja yhdistää sen lambdaan ilman context-objektia:

```cpp
void ItemRow::addActionButton() {
    auto *btn = new QPushButton(tr("Poista"), this);
    connect(btn, &QPushButton::clicked, [this, btn]() {
        emit removeRequested(m_index);
        btn->deleteLater();
    });
}
```

Kun koko `ItemRow` tuhoutuu, lambda-yhteys elää edelleen. Jos nappi ehtii emitoida `clicked` tuhoutumisen jälkeen, lambda viittaa vapautettuun `this`-pointeriin.

## Ratkaisu

Anna connectille context-objekti — yhteys katkeaa automaattisesti contextin tuhoutuessa:

```cpp
connect(btn, &QPushButton::clicked, this, [this, btn]() {
    emit removeRequested(m_index);
    btn->deleteLater();
});
```

Lambda connections context — Qt docs QObject connect lambda. Kun `this` (`ItemRow`) tuhoutuu, Qt irrottaa kaikki yhteydet, joissa se on context.

## Käytännössä

Sääntö: `connect(sender, signal, context, lambda)` — kolmas argumentti on aina elinikä-guard. Ilman contextia tallenna `QMetaObject::Connection` ja `disconnect` destructorissa.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#connect)

# Yksi slot käsittelee usean napin clicked-signaalin — miten tunnistat klikatun napin?

## Tilanne

Työkalupalkissa viisi toimintonappia jakaa saman käsittelijän:

```cpp
void ToolbarWidget::setupButtons() {
    connect(ui->btnNew,  &QPushButton::clicked, this, &ToolbarWidget::onToolClicked);
    connect(ui->btnOpen, &QPushButton::clicked, this, &ToolbarWidget::onToolClicked);
    connect(ui->btnSave, &QPushButton::clicked, this, &ToolbarWidget::onToolClicked);
}
```

Yksi slotti pitää tietää, kumpaa nappia painettiin. Erilliset slotit jokaiselle napille tuottaisivat toistuvaa koodia.

## Ratkaisu

Käytä `QObject::sender()` ja castaa tulos `QPushButton*`:ksi:

```cpp
void ToolbarWidget::onToolClicked() {
    auto *btn = qobject_cast<QPushButton *>(sender());
    if (!btn) return;

    if (btn == ui->btnNew)  createDocument();
    else if (btn == ui->btnOpen) openDocument();
    else if (btn == ui->btnSave) saveDocument();
}
```

`sender()` palauttaa signaalin lähettäjän — Qt Signals & Slots. `qobject_cast` on turvallisempi kuin raaka `static_cast`, jos slottiin johtaa useampi signaalityyppi.

## Käytännössä

Lambda + `QPushButton*` capture on moderni vaihtoehto ilman `sender()`-kutsua. `sender()` toimii vain slottimetodissa signaalin käsittelyn aikana — älä tallenna pointeria myöhempää käyttöä varten.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#sender)

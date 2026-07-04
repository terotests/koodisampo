# Lambda-slotti connectissa — disconnect ei toimi osoitteella. Miksi?

## Tilanne

Kehittäjä yhdistää napin lambda-slottiin ja yrittää irrottaa sen myöhemkin:

```cpp
void Panel::setup() {
    connect(ui->toggleBtn, &QPushButton::clicked, this, [this]() {
        m_visible = !m_visible;
        update();
    });
}

void Panel::teardown() {
    disconnect(ui->toggleBtn, &QPushButton::clicked, this, nullptr);
    // ei irrota lambda-yhteyttä!
}
```

`disconnect` ei löydä yhteyttä, koska jokainen lambda on erillinen funktio-objekti. Toggle jää aktiiviseksi panelin tuhoutumisen jälkeen → crash.

## Ratkaisu

Tallenna `QMetaObject::Connection` tai käytä context-disconnectia:

```cpp
void Panel::setup() {
    m_toggleConn = connect(ui->toggleBtn, &QPushButton::clicked, this, [this]() {
        m_visible = !m_visible;
        update();
    });
}

void Panel::teardown() {
    disconnect(m_toggleConn);
}

// tai: connect(..., this, lambda) — this contextina, katkeaa automaattisesti
```

Jokainen lambda on uniikki funktio-objekti — tallenna connection tai käytä context disconnect. `QObject::disconnect` tarvitsee saman functorin tai tuhoutuvan context-objektin — Qt docs.

## Käytännössä

Suosi `connect(sender, signal, this, lambda)` — `this` contextina on yleensä riittävä. Jos tarvitset irrottamista ilman tuhoutumista, tallenna `QMetaObject::Connection` jäsenmuuttujaan.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#connect)

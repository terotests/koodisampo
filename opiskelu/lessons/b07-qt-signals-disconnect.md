# Dialogi tuhoutuu, mutta sen osoitinta käyttävä lambda-slot kutsutaan yhä — use-after-free. Mitä teit väärin?

## Tilanne

Asetusdialogi kuuntelee pitkää taustatehtävää lambdalla:

```cpp
void ConfigDialog::apply() {
    m_engine->startMigration();
    connect(m_engine, &Engine::migrationDone, [this] {
        m_resultLabel->setText(tr("Migraatio valmis"));
    });
    accept();  // dialog sulkeutuu heti
}
```

`accept()` tuhoaa dialogin (`WA_DeleteOnClose`). Migraatio valmistuu minuutin päästä ja lambda käyttää tuhoutuneen dialogin osoitinta.

Kehittäjä oletti Qt:n katkaisevan yhteyden dialogin tuhoutuessa — mutta lambdalla ei ole context-oliota, joten yhteys on sidottu vain `Engine`n elinikään.

## Ratkaisu

Anna dialogi connectille context-olioksi:

```cpp
void ConfigDialog::apply() {
    m_engine->startMigration();
    connect(m_engine, &Engine::migrationDone, this, [this] {
        m_resultLabel->setText(tr("Migraatio valmis"));
    });
    accept();
}
```

Qt katkaisee yhteydet automaattisesti, kun vastaanottaja tai context-olio tuhoutuu — myös jäsenfunktio-slotit (`connect(..., this, &ConfigDialog::onMigrationDone)`). Ilman context-oliota lambda-yhteys pitää katkaista itse tallentamalla `QMetaObject::Connection` ja kutsumalla `disconnect()`.

## Käytännössä

Modalinen flow: odota tehtävän valmistumista ennen `accept()`:ia tai siirrä callback ikkunaan, joka elää pidempään. Code reviewissä kolmen argumentin `connect(sender, signal, lambda)` on varoitusmerkki, jos lambda kaappaa osoittimia.

[Lue lisää](https://doc.qt.io/qt-6/signalsandslots.html)

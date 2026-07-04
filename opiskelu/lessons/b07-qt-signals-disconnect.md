# Dialogi sulkeutuu mutta slot kutsutaan yhä — use-after-free. Mitä teit väärin?

## Tilanne

Asetusdialogi kuuntelee pitkää taustatehtävää:

```cpp
void ConfigDialog::apply() {
    m_engine->startMigration();
    connect(m_engine, &Engine::migrationDone,
            this, &ConfigDialog::onMigrationDone);
    accept();  // dialog sulkeutuu heti
}
```

`accept()` tuhoaa dialogin (`WA_DeleteOnClose`). Migration valmistuu minuutin päästä ja `onMigrationDone()` kutsutaan tuhoutuneeseen objektiin.

Kehittäjä oletti parent-child -suhteen suojaavan automaattisesti — mutta `Engine` ei ole dialogin lapsi.

## Ratkaisu

Irrota yhteys tai varmista elinkaari — QObject elinikä hallitsee signaaliyhteyksiä:

```cpp
void ConfigDialog::apply() {
    connect(m_engine, &Engine::migrationDone,
            this, &ConfigDialog::onMigrationDone);
    // älä accept() ennen valmistumista TAI:
}

ConfigDialog::~ConfigDialog() {
    disconnect(m_engine, &Engine::migrationDone,
               this, &ConfigDialog::onMigrationDone);
}
```

Ei disconnect tai parent — QObject elinikä hallitsee signaaliyhteyksiä. Disconnect or destroy receiver — Qt object lifetime. Vaihtoehto: `connect(..., this, slot)` contextina.

## Käytännössä

Modalinen flow: odota tehtävän valmistumista ennen `accept()`:ia tai siirrä callback vastaanottavaan ikkunaan, joka elää pidempään. `QPointer<ConfigDialog>` workerin puolella on toinen turvakerros.

[Lue lisää](https://doc.qt.io/qt-6/signalsandslots.html)

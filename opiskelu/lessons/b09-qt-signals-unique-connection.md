# Sama connect() kutsutaan useasti initissä — slotti laukeaa monta kertaa. Estä?

## Tilanne

Singleton-pohjaisessa palvelussa `NotificationService::init()` kutsutaan useasta paikasta sovelluksen käynnistyessä:

```cpp
void NotificationService::init() {
    connect(QApplication::instance(), &QApplication::aboutToQuit,
            this, &NotificationService::flushPending);
}
```

Kolme eri moduulia kutsuu `init()`:iä — `flushPending()` ajetaan kolme kertaa sammutuksessa. Viimeiset ilmoitukset kirjoitetaan kolminkertaisesti lokiin.

## Ratkaisu

Käytä `Qt::UniqueConnection` estämään duplikaattiyhteydet:

```cpp
void NotificationService::init() {
    if (m_initialized) return;
    connect(QApplication::instance(), &QApplication::aboutToQuit,
            this, &NotificationService::flushPending,
            Qt::UniqueConnection);
    m_initialized = true;
}
```

`Qt::UniqueConnection` — connect epäonnistuu jos yhteys on jo olemassa. Qt::UniqueConnection — Qt connect docs.

## Käytännössä

Yhdistä `UniqueConnection` idempotenttiin init-lippuun (`m_initialized`). Pelkkä lippu riittää, mutta `UniqueConnection` on turvallinen varmuuskerros, jos init-polkuja on useita.

[Lue lisää](https://doc.qt.io/qt-6/qt.html#ConnectionType-enum)

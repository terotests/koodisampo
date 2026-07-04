# Sama connect() kutsutaan initissä kahdesti — slotti suoritetaan kaksinkertaisesti. Esto?

## Tilanne

Plugin-järjestelmässä `PluginHost::initialize()` kutsuu `registerHandlers()` kahdesti — kerran bootissa ja kerran plugin-reloadissa:

```cpp
void PluginHost::registerHandlers() {
    connect(m_eventBus, &EventBus::userAction,
            this, &PluginHost::dispatchAction);
}
```

Jokainen käyttäjän toiminto laukaisee `dispatchAction()`:n kahdesti. Lokissa sama tapahtuma-ID toistuu peräkkäin ja kaksi handleria suorittaa saman sivutehon.

## Ratkaisu

Lisää `Qt::UniqueConnection`:

```cpp
void PluginHost::registerHandlers() {
    connect(m_eventBus, &EventBus::userAction,
            this, &PluginHost::dispatchAction,
            Qt::UniqueConnection);
}
```

`Qt::UniqueConnection` — connect epäonnistuu jos yhteys on jo olemassa. UniqueConnection prevents duplicate connections — Qt connect docs.

## Käytännössä

Plugin-reloadissa sender (`EventBus`) voi pysyä samana — `UniqueConnection` on kätevä. Jos sender vaihtuu, irrota vanha yhteys eksplisiittisesti ennen uuden senderin connectausta.

[Lue lisää](https://doc.qt.io/qt-6/qt.html#ConnectionType-enum)

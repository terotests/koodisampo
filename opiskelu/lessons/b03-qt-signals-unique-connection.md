# Sama connect() kutsutaan initissä ja refreshissä — slot ajetaan kaksi kertaa. Qt-lippu?

## Tilanne

Dashboard-widget kutsuu `wireSignals()` sekä konstruktorissa että `refreshDataSources()`-metodissa, kun käyttäjä vaihtaa tietolähteen:

```cpp
void DashboardWidget::wireSignals() {
    connect(m_dataSource, &DataSource::metricsUpdated,
            this, &DashboardWidget::redraw);
}
```

Ensimmäisen refreshin jälkeen `redraw()` kutsutaan kaksi kertaa jokaisesta `metricsUpdated`-signaalista. Kaaviot piirtyvät kahdesti ja CPU-käyttö tuplaantuu.

Kehittäjä yrittää ensin `disconnect()` ennen connectia, mutta unohtaa sen refresh-polussa.

## Ratkaisu

Lisää `Qt::UniqueConnection` — se estää duplikaattiyhteydet:

```cpp
void DashboardWidget::wireSignals() {
    connect(m_dataSource, &DataSource::metricsUpdated,
            this, &DashboardWidget::redraw,
            Qt::UniqueConnection);
}
```

`Qt::UniqueConnection` — estää duplikaattiyhteydet. Connect epäonnistuu hiljaa jos yhteys on jo olemassa, joten slotti ajetaan tasan kerran.

## Käytännössä

`UniqueConnection` sopii erityisesti init/refresh -funktioihin, joita kutsutaan useasti. Se ei korvaa oikeaa disconnect-logiikkaa, jos sender-objekti vaihtuu — silloin irrota vanha yhteys ennen uuden senderin connectausta.

[Lue lisää](https://doc.qt.io/qt-6/qt.html#ConnectionType-enum)

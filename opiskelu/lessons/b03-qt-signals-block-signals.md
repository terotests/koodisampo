# Lataat modelin UI:hin — jokainen setValue laukaisee signaalin ja aiheuttaa loopin. Estä?

## Tilanne

Asetusnäkymässä lomake sidotaan `QSettings`-objektiin. Latauksen aikana jokainen kenttä päivitetään:

```cpp
void SettingsForm::loadFromSettings() {
    ui->hostEdit->setText(m_settings->value("host").toString());
    ui->portSpin->setValue(m_settings->value("port").toInt());
    // ...
}
```

Jokainen `setValue` laukaisee `valueChanged`-signaalin, joka on kytketty `saveToSettings()`-slottiin. Slotti kirjoittaa takaisin settingsiin, joka laukaisee uuden latauksen — re-entrant loop hidastaa käynnistyksen ja voi aiheuttaa stack overflow -varoituksen.

## Ratkaisu

Hiljennä signaalit päivityksen ajaksi `QSignalBlocker`:illa tai `blockSignals(true)`:

```cpp
void SettingsForm::loadFromSettings() {
    QSignalBlocker blockerHost(ui->hostEdit);
    QSignalBlocker blockerPort(ui->portSpin);
    ui->hostEdit->setText(m_settings->value("host").toString());
    ui->portSpin->setValue(m_settings->value("port").toInt());
}
// blockerit palauttavat signaalit automaattisesti
```

`blockSignals` estää re-entrant päivitykset — QObject API. RAII-tyylinen `QSignalBlocker` varmistaa, ettei `blockSignals(false)` jää unohtumaan poikkeuksessa.

## Käytännössä

Bulk-latauksissa ja model-synkronoinnissa hiljennä aina vastaanottaja, ei lähettäjä. Jos lataat satoja kenttiä, harkitse yhden `blockSignals(true)` koko lomakkeelle parent-widgetissä.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#blockSignals)

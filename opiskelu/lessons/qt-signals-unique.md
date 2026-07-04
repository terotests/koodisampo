# Sama signaali connectataan kahdesti samaan slottiin. Miten estät duplikaattikutsut?

## Tilanne

Asetusikkunassa `SettingsDialog` kutsuu `setupConnections()` sekä konstruktorissa että `reloadProfile()`-metodissa. Molemmissa kohdissa tehdään sama yhteys:

```cpp
void SettingsDialog::setupConnections() {
    connect(ui->applyButton, &QPushButton::clicked,
            this, &SettingsDialog::applySettings);
}
```

Käyttäjä avaa dialogin, vaihtaa profiilia ja painaa *Käytä* — `applySettings()` ajetaan kaksi kertaa per klikkaus. Tietokantaan kirjoitetaan duplikaattirivi ja lokissa näkyy kaksi peräkkäistä `COMMIT`-riviä.

Ongelma toistuu aina kun `reloadProfile()` ajetaan, koska yhteys luodaan uudelleen ilman että vanha irrotetaan.

## Ratkaisu

Käytä `Qt::UniqueConnection` connect-viitelaskurissa — yhteys luodaan vain jos sitä ei ole jo olemassa:

```cpp
void SettingsDialog::setupConnections() {
    connect(ui->applyButton, &QPushButton::clicked,
            this, &SettingsDialog::applySettings,
            Qt::UniqueConnection);
}
```

`Qt::UniqueConnection` epäonnistuu hiljaa jos yhteys on jo olemassa. Slotti ajetaan siis korkeintaan kerran per signaali, vaikka `setupConnections()` kutsuttaisiin useasti.

## Käytännössä

Pidä connect-kutsut yhdessä paikassa (esim. konstruktorissa) tai irrota vanhat yhteydet ennen uudelleenconnectausta. `UniqueConnection` on turvallinen varmistus init/refresh -poluissa, joissa sama funktio voi ajautua useammin kuin kerran elinkaaren aikana.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#connect)

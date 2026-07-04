# Käyttäjä säätää paneelien kokoa QSplitterillä — asetus katoaa restartissa. Ratkaisu?

## Tilanne

IDE:ssä vasen tiedostopuu ja oikea editori on erotettu `QSplitter`:illä. Käyttäjä säätää jaon mieleisekseen, mutta seuraavalla käynnistyksellä paneelit ovat taas oletuskokoisina.

```cpp
auto *splitter = new QSplitter(Qt::Horizontal, this);
splitter->addWidget(m_fileTree);
splitter->addWidget(m_editor);
splitter->setSizes({200, 800});
// Ei tallennusta — asetus katoaa
```

## Ratkaisu

`saveState()`/`restoreState()` QSettingsiin — splitter-tila session välillä:

```cpp
// Konstruktorissa / showEvent:
QSettings settings("MyCompany", "MyIDE");
splitter->restoreState(settings.value("mainSplitter").toByteArray());

// Suljettaessa / closeEvent:
QSettings settings("MyCompany", "MyIDE");
settings.setValue("mainSplitter", splitter->saveState());
```

`saveState()` tallentaa byte-arrayn, joka sisältää kunkin osan koon. QSplitter saveState/restoreState — Qt docs.

## Käytännössä

Tallenna myös ikkunan `geometry` (`saveGeometry()`) samassa `QSettings`-avaimessa. Käsittele ensimmäinen käynnistys: jos `settings.value(...).isNull()`, käytä oletus `setSizes`. Älä tallenna joka resize-eventissä — `closeEvent` riittää.

[Lue lisää](https://doc.qt.io/qt-6/qsplitter.html#saveState)

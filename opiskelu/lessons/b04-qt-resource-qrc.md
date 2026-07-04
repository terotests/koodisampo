# Ikoni puuttuu asennetusta binääristä — tiedosto on vain dev-koneen polussa. Qt-ratkaisu?

## Tilanne

Sovellus lataa ikonin absoluuttisella polulla:

```cpp
app.setWindowIcon(QIcon("/home/dev/proj/assets/icons/app.png"));
toolbar->addAction(QIcon("/home/dev/proj/assets/icons/save.png"), "Tallenna");
```

Kehityskoneella ikonit näkyvät. Asennetussa `.deb`- tai `.msi`-paketissa ikkuna ja toolbar ovat ilman kuvakkeita — polku ei ole olemassa loppukäyttäjän koneella.

## Ratkaisu

Qt Resource System (`.qrc`) — `:/icons/app.png` upotettuna binaryyn:

```xml
<!-- resources.qrc -->
<RCC>
  <qresource prefix="/icons">
    <file>assets/icons/app.png</file>
    <file>assets/icons/save.png</file>
  </qresource>
</RCC>
```

```cpp
app.setWindowIcon(QIcon(":/icons/app.png"));
saveAction->setIcon(QIcon(":/icons/save.png"));
```

CMakeLists.txt:

```cmake
qt_add_resources(MY_APP "resources" FILES resources.qrc)
```

qrc upottaa resurssit executableen — Qt Resource System.

## Käytännössä

Käytä `:/`-prefiksiä aina shipped-resursseille (ikonit, fontit, pienet QSS-tiedostot). Suuret mediatiedostot kannattaa jakaa erikseen, mutta sovelluksen core-ikonit kuuluvat `.qrc`:ään. Testaa release-build ilman lähdekoodihakemistoa.

[Lue lisää](https://doc.qt.io/qt-6/resources.html)

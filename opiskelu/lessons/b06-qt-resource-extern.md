# QRC-resurssi pitää päivittää ilman uudelleenkäännöstä. Miten ulkoiset resurssit?

## Tilanne

Teeman värit ja ikonit on upotettu `.qrc`:ään. Asiakas haluaa vaihtaa brändivärit ilman uutta release-buildia — `.qrc` vaatii uudelleenkäännön joka kerta.

```cpp
QFile f(":/themes/default.qss");  // upotettu binaryyn — ei päivity lennosta
```

## Ratkaisu

`QResource registerResource` tai external path — päivitys ilman uudelleenkäännöstä:

```cpp
// Käynnistyksessä — ulkoinen .rcc-tiedosto
QResource::registerResource("/opt/myapp/themes/custom.rcc");

// Tai suora polku tiedostojärjestelmästä:
QFile styleFile("/opt/myapp/themes/custom.qss");
if (styleFile.open(QIODevice::ReadOnly))
    qApp->setStyleSheet(styleFile.readAll());
```

`.rcc` generoidaan erikseen:

```bash
rcc -binary themes/custom.qrc -o custom.rcc
```

The Qt Resource System — Qt docs resource system.

## Käytännössä

Pidä core-resurssit (sovellusikoni, fallback-tyyli) `.qrc`:ssä ja customoitavat teemat ulkoisina `.rcc`/`.qss`-tiedostoina. `unregisterResource` puhdistaa vanhan teeman ennen uuden latausta. Dokumentoi polku konfiguraatiotiedostossa (`QSettings`).

[Lue lisää](https://doc.qt.io/qt-6/resources.html)

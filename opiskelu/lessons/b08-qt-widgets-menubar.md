# Desktop-sovelluksessa päävalikko puuttuu macOS:llä vaikka QMenuBar on luotu. Tyypillinen syy?

## Tilanne

Windowsilla ja Linuxilla `QMenuBar` näkyy ikkunan yläreunassa. macOS-buildissa valikko "katoaa" ikkunasta — kehittäjä luulee, ettei sitä luoda ollenkaan:

```cpp
auto *menuBar = new QMenuBar(this);
setMenuBar(menuBar);
auto *fileMenu = menuBar->addMenu("&Tiedosto");
fileMenu->addAction("Avaa");
```

Debuggerissa `menuBar` on olemassa ja sisältää toimintoja.

## Ratkaisu

macOS siirtää menubar yläreunaan — `setNativeMenuBar(true)` käyttäytyminen:

```cpp
#ifdef Q_OS_MACOS
menuBar->setNativeMenuBar(true);  // oletus — valikko näkyy ruudun yläreunan valikkopalkissa
#endif
```

Valikko **ei puutu** — se on macOS:n globaalissa valikkopalkissa (ruudun yläreuna), ei ikkunan sisällä. Native menu bar on macOS — QMenuBar docs.

Jos haluat valikon ikkunan sisään macOS:llä (esim. debuggausta varten):

```cpp
menuBar->setNativeMenuBar(false);
```

## Käytännössä

Testaa macOS:llä ennen releaseä — `QAction`-shortcutit toimivat natiivissa menubarissa eri tavalla kuin ikkunan sisäisessä. `Qt::AA_DontUseNativeMenuBar` sovellustasolla pakottaa ei-natiivin menubar-käyttäytymisen.

[Lue lisää](https://doc.qt.io/qt-6/qmenubar.html)

# Ikkuna resize repi widgetit — kovakoodatut setGeometry-kutsut. Parempi Qt-tapa?

## Tilanne

Vanha työpöytäsovellus asettaa kaikki komponentit kiinteillä koordinaateilla:

```cpp
void MainWindow::setupUi() {
    auto *saveBtn = new QPushButton("Tallenna", this);
    saveBtn->setGeometry(10, 10, 80, 30);

    auto *logView = new QTextEdit(this);
    logView->setGeometry(10, 50, 600, 400);
}
```

Kun käyttäjä venyttää ikkunan reunaa, nappi jää vasempaan yläkulmaan ja lokiruutu ei kasva. Pienellä näytöllä osa widgeteistä leikkaantuu ruudun ulkopuolelle.

## Ratkaisu

`QLayout` (`QVBoxLayout`/`QHBoxLayout`) hoitaa resizen automaattisesti:

```cpp
void MainWindow::setupUi() {
    auto *central = new QWidget(this);
    setCentralWidget(central);

    auto *layout = new QVBoxLayout(central);
    auto *saveBtn = new QPushButton("Tallenna", central);
    auto *logView = new QTextEdit(central);

    layout->addWidget(saveBtn);
    layout->addWidget(logView, 1);  // stretch = 1 — lokiruutu venyy
}
```

Layout manager hoitaa geometryn — Qt Widgets docs. `setLayout()` tai `QVBoxLayout(central)` riittää — ei `setGeometry`-kutsuja.

## Käytännössä

Refaktoroi legacy-koodi vaiheittain: korvaa absoluuttiset koordinaatit layouteilla ja `QSplitter`:illä monipaneelisiin näkymiin. Marginaalit ja spacing tulevat `layout->setContentsMargins()` ja `setSpacing()` -kutsuilla, ei magic numbereista.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#setLayout)

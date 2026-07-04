# Nappi näyttää erilaiselta macOS vs Windows — haluat yhtenäisen ulkoasun. Qt-ratkaisu?

## Tilanne

Sovellus käyttää natiiveja widgettejä ilman tyylittelyä. Windowsilla napit ovat suorakulmaisia harmaita, macOS:llä pyöristettyjä ja läpinäkyviä. Asiakas vaatii saman brändi-UI:n kaikilla alustoilla.

```cpp
auto *btn = new QPushButton("Lataa");
// Natiivi QStyle — eri ulkoasu jokaisella OS:llä
```

## Ratkaisu

QSS stylesheet tai QStyle — yhtenäinen ulkoasu platform-riippumattomasti:

```cpp
// Vaihtoehto 1: Qt Style Sheets
qApp->setStyleSheet(R"(
    QPushButton {
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 20px;
    }
    QPushButton:hover { background-color: #0052a3; }
)");

// Vaihtoehto 2: yhtenäinen fusion-tyyli ilman QSS:ää
QApplication::setStyle(QStyleFactory::create("Fusion"));
QPalette palette;
palette.setColor(QPalette::Button, QColor("#0066cc"));
qApp->setPalette(palette);
```

Qt Style Sheets customize appearance — Qt Style Sheets.

## Käytännössä

`Fusion`-tyyli + QSS on yleinen yhdistelmä cross-platform-sovelluksissa. Testaa kontrasti ja hover-tilat kaikilla alustoilla. macOS:llä `setUnifiedTitleAndToolBarOnMac(true)` vaikuttaa chromeen erikseen widget-tyyleistä.

[Lue lisää](https://doc.qt.io/qt-6/stylesheet.html)

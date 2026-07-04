# QPushButton tyyli pitää vaihtaa globaalisti ilman jokaista setStyleSheet-kutsua. Ratkaisu?

## Tilanne

Sovelluksessa on satoja nappeja eri ikkunoissa. Brändiohje vaatii tummansinisen taustan ja pyöristetyt kulmat. Joku on lisännyt joka tiedostoon:

```cpp
button->setStyleSheet("QPushButton { background: #1a3a5c; border-radius: 6px; }");
```

Uusi kehittäjä unohtaa kutsun — yksi nappi näyttää natiivilta Windows-napilta kesken muutoin yhtenäisen UI:n.

## Ratkaisu

`QApplication::setStyleSheet` tai `.qss` tiedosto + `setStyleSheet` lukee tiedoston:

```cpp
// main.cpp — koko sovellukselle
QFile styleFile(":/styles/app.qss");
if (styleFile.open(QIODevice::ReadOnly)) {
    qApp->setStyleSheet(QString::fromUtf8(styleFile.readAll()));
}
```

`.qss`-tiedostossa:

```css
QPushButton {
    background-color: #1a3a5c;
    color: white;
    border-radius: 6px;
    padding: 6px 16px;
}
QPushButton:disabled {
    background-color: #888;
}
```

Qt Style Sheets keskitetty ulkoasu — doc.qt.io/stylesheet.

## Käytännössä

QSS ylikirjoittaa natiivin tyylin — testaa kaikilla alustoilla. Spesifiset poikkeukset: `widget->setProperty("class", "danger")` + selektori `QPushButton[class="danger"]`. Älä sekoita QSS:ää ja `QStyle`-overrideja samassa widgetissä ilman syytä.

[Lue lisää](https://doc.qt.io/qt-6/stylesheet.html)

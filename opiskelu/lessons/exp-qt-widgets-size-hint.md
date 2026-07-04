# Custom widget leikkaa tekstiä eri DPI:llä. Mikä metodi pitää overridata layoutin oikeaa kokoa varten?

## Tilanne

Olet toteuttanut `StatusBadge`-widgetin, joka piirtää värillisen tekstin `paintEvent`:issä:

```cpp
class StatusBadge : public QWidget {
protected:
    void paintEvent(QPaintEvent *) override {
        QPainter p(this);
        p.drawText(rect(), Qt::AlignCenter, m_text);
    }
private:
    QString m_text;
};
```

Kehityskoneella (96 DPI) badge näyttää hyvältä. QA-testaajan 150 % skaalatulla näytöllä teksti leikkaantuu — layout antaa widgetille liian vähän tilaa, koska se ei tiedä tekstin todellista kokoa.

## Ratkaisu

Overridaa `sizeHint()` ja tarvittaessa `minimumSizeHint()` layoutille:

```cpp
QSize StatusBadge::sizeHint() const {
    QFontMetrics fm(font());
    const int w = fm.horizontalAdvance(m_text) + 16;
    const int h = fm.height() + 8;
    return QSize(w, h);
}

QSize StatusBadge::minimumSizeHint() const {
    return sizeHint();
}
```

Layout kysyy `sizeHint`:ia ennen sijoittamista — Qt Widgets sizing doc. `QFontMetrics` huomioi DPI-skaalauksen automaattisesti.

## Käytännössä

Testaa custom widgetit eri `QT_SCALE_FACTOR`-arvoilla CI:ssä. Jos widget muuttaa sisältöään dynaamisesti, kutsu `updateGeometry()` ja `adjustSize()` tekstin vaihtuessa. `sizePolicy` vaikuttaa siihen, miten ylimääräinen tila jaetaan — mutta ilman oikeaa `sizeHint`:ia layout ei edes tiedä lähtökohtaa.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#sizeHint)

# Custom nappi ei saa näppäimistöfokusta Tabilla. Mitä asetat?

## Tilanne

Olet tehnyt `IconButton`-widgetin, joka piirtää ikonin `paintEvent`:issä mutta ei peri `QPushButton`:ia:

```cpp
class IconButton : public QWidget {
    Q_OBJECT
public:
    explicit IconButton(QWidget *parent = nullptr) : QWidget(parent) {
        setCursor(Qt::PointingHandCursor);
    }
signals:
    void clicked();
protected:
    void mousePressEvent(QMouseEvent *) override { emit clicked(); }
};
```

Hiiri toimii, mutta Tab ei pysähdy nappiin — näppäimistökäyttäjät eivät pääse painamaan Enterillä.

## Ratkaisu

`setFocusPolicy(Qt::StrongFocus)` — widget tab orderiin näppäimistöfokuksella:

```cpp
IconButton::IconButton(QWidget *parent) : QWidget(parent) {
    setFocusPolicy(Qt::StrongFocus);
    setCursor(Qt::PointingHandCursor);
}

void IconButton::keyPressEvent(QKeyEvent *event) {
    if (event->key() == Qt::Key_Return || event->key() == Qt::Key_Space) {
        emit clicked();
        return;
    }
    QWidget::keyPressEvent(event);
}
```

focusPolicy determines keyboard focus — QWidget.

## Käytännössä

Piirrä fokusindikaattori (`paintEvent`:issä `hasFocus()` tarkistus) esteettömyyden vuoksi. Harkitse `QPushButton` + `setFlat(true)` + custom tyyli — se saa fokuksen ja accessibility-tuen ilmaiseksi. `Qt::TabFocus` riittää, jos widget ei tarvitse hiirifokusta.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#focusPolicy-prop)

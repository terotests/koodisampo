# Custom widget leikkaa tekstiä layoutissa. Mitä metodia ylikirjoitat?

## Tilanne

`TagLabel`-widget piirtää tagin tekstin `paintEvent`:issä, mutta layout antaa sille vain oletuskoon (100×30):

```cpp
class TagLabel : public QWidget {
public:
    void setTag(const QString &tag) { m_tag = tag; update(); }
protected:
    void paintEvent(QPaintEvent *) override {
        QPainter p(this);
        p.drawText(rect(), Qt::AlignCenter, m_tag);
    }
private:
    QString m_tag;
};
```

Pitkä tagi "KRIITTINEN-VIRHE-QA" leikkaantuu widgetin reunoihin.

## Ratkaisu

`sizeHint()` — layout käyttää ehdotettua kokoa widgetin sijoittamiseen:

```cpp
QSize TagLabel::sizeHint() const {
    QFontMetrics fm(font());
    return QSize(fm.horizontalAdvance(m_tag) + 12, fm.height() + 6);
}
```

Kutsu `updateGeometry()` kun tagi vaihtuu:

```cpp
void TagLabel::setTag(const QString &tag) {
    m_tag = tag;
    updateGeometry();
    update();
}
```

sizeHint tells layout preferred size — QWidget docs.

## Käytännössä

Jos widget voi kutistua alle `sizeHint`:in, override myös `minimumSizeHint()`. Layout-testauksessa tarkista eri fonttikoot ja i18n-käännökset — saksalainen teksti voi olla 40 % pidempi kuin suomi.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#sizeHint)

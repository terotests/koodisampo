# Tab-järjestys lomakkeessa on väärä — käyttäjä tabbaa satunnaisesti. Miten korjaat?

## Tilanne

Rekisteröintilomakkeessa kentät on lisätty layoutiin visuaalisessa järjestyksessä, mutta Tab hyppii: sähköposti → puhelin → nimi → salasana. Qt asettaa tab-järjestyksen luontijärjestyksen mukaan, joka ei vastaa visuaalista flow'ta.

```cpp
layout->addWidget(m_nameEdit);     // visuaalisesti ylin
layout->addWidget(m_emailEdit);
// m_phoneEdit lisätty myöhemmin eri funktiossa
addPhoneField();  // tab-järjestys rikki
```

## Ratkaisu

`setTabOrder(widget1, widget2)` — eksplisiittinen tab-ketju lomakkeessa:

```cpp
QWidget::setTabOrder(m_nameEdit, m_emailEdit);
QWidget::setTabOrder(m_emailEdit, m_phoneEdit);
QWidget::setTabOrder(m_phoneEdit, m_passwordEdit);
QWidget::setTabOrder(m_passwordEdit, m_submitBtn);
```

Tai ketjuna:

```cpp
setTabOrder(m_nameEdit, m_emailEdit);
setTabOrder(m_emailEdit, m_phoneEdit);
// ...
```

QWidget tab order — Qt docs setTabOrder.

## Käytännössä

Testaa tab-järjestys näppäimistöllä jokaisessa lomake-näkymässä — se on WCAG-vaatimus. Qt Designerissa tab order -editori helpottaa. Muista myös `setFocusPolicy` — widgetit, joilla on `NoFocus`, ohitetaan ketjussa.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#setTabOrder)

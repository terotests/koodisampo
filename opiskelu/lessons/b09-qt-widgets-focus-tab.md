# Lomakkeessa tab-järjestys hyppii satunnaisesti. Mitä tarkistat?

## Tilanne

Monimutkaisessa lomakkeessa tab siirtyy odottamattomasti: kenttä A → painike X → kenttä B, vaikka visuaalinen järjestys on A → B → C. Ongelma ilmestyi, kun osa kentistä lisättiin dynaamisesti `addWidget`:llä eri funktioista.

```cpp
void FormPage::addOptionalFields() {
    m_vatEdit = new QLineEdit(this);
    layout()->addWidget(m_vatEdit);  // tab-järjestys ei päivity automaattisesti
}
```

## Ratkaisu

`setTabOrder()` widgettien välillä — tarkista focus chain lomakkeessa:

```cpp
// Kun kaikki kentät on luotu:
QWidget::setTabOrder(m_nameEdit, m_addressEdit);
QWidget::setTabOrder(m_addressEdit, m_vatEdit);
QWidget::setTabOrder(m_vatEdit, m_submitBtn);

// Debuggaus: tulosta focus chain
QWidget *w = m_nameEdit;
while (w) {
    qDebug() << w->objectName() << w->focusPolicy();
    w = w->nextInFocusChain();
}
```

Tab order määritellään eksplisiittisesti — QWidget focus.

## Käytännössä

Kun lisäät kenttiä dynaamisesti, päivitä tab order heti lisäyksen jälkeen. Tarkista että välikentät eivät varasta fokusta (`setFocusPolicy(Qt::NoFocus)` frameille ja labeleille). Qt Designerin tab order -näkymä auttaa staattisissa lomakkeissa — dynaamisissa tarvitset koodia.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#setTabOrder)

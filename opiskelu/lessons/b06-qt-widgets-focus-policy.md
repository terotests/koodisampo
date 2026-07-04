# Label saa fokuksen tabilla mutta ei pitäisi. Mitä muutat?

## Tilanne

Lomakkeessa jokaisen kentän edessä on `QLabel`:

```cpp
auto *nameLabel = new QLabel("Nimi:", form);
auto *nameEdit = new QLineEdit(form);
layout->addRow(nameLabel, nameEdit);
```

Tab-näppäin pysähtyy labeliin — kehys piirtyy sen ympärille, mutta käyttäjä ei voi kirjoittaa mitään. Esteettömyystestaus raportoi turhasta fokuspysähdyksestä.

## Ratkaisu

`setFocusPolicy(Qt::NoFocus)` — label ei saa näppäimistöfokusta tabilla:

```cpp
nameLabel->setFocusPolicy(Qt::NoFocus);
// Tai kaikille labeleille kerralla:
for (auto *label : findChildren<QLabel *>()) {
    label->setFocusPolicy(Qt::NoFocus);
}
```

Qt focus policy — Qt docs QWidget focusPolicy. `QLabel`:n oletus on `TabFocus` tai `NoFocus` riippuen Qt-versiosta — aseta eksplisiittisesti.

## Käytännössä

`QFormLayout::addRow("Nimi:", edit)` luo labelin automaattisesti — varmista ettei se saa fokusta. Buddy-linkitys (`label->setBuddy(edit)`) antaa Alt+shortcut-fokuksen ilman tab-pysähdystä labelissa.

[Lue lisää](https://doc.qt.io/qt-6/qwidget.html#focusPolicy-prop)

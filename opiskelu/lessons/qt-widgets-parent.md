# Miksi QWidget:lle annetaan parent-osoitin konstruktorissa?

## Tilanne

Rakennat asetusikkunaa, jossa on kymmeniä pieniä widgettejä — labeleita, kenttiä ja nappeja. Jokainen luodaan `new QLineEdit()` ilman parenttia, lisätään layoutiin ja unohdetaan:

```cpp
void SettingsDialog::buildUi() {
    auto *layout = new QVBoxLayout(this);
    auto *nameEdit = new QLineEdit();  // ei parenttia
    auto *emailEdit = new QLineEdit();
    layout->addWidget(nameEdit);
    layout->addWidget(emailEdit);
}
```

Dialogi sulkeutuu, mutta Valgrind raportoi satoja tavuja vuotavia `QLineEdit`-objekteja. Layout ei omista widgettejä — se vain hallitsee niiden sijoitusta.

Qt:n widget-puu perustuu QObject-parenttisuhteeseen, ei pelkkään layoutiin.

## Ratkaisu

Anna parent konstruktorissa — parent hoitaa omistajuuden: lapset tuhotaan automaattisesti ja layout järjestää sijainnit:

```cpp
void SettingsDialog::buildUi() {
    auto *layout = new QVBoxLayout(this);
    auto *nameEdit = new QLineEdit(this);   // parent = this
    auto *emailEdit = new QLineEdit(this);
    layout->addWidget(nameEdit);
    layout->addWidget(emailEdit);
}
```

Kun `SettingsDialog` tuhoutuu, kaikki lapset vapautuvat. QObject-puu: parent tuhoaa lapset — vähemmän vuotoja.

## Käytännössä

Käytä parenttia aina kun widget elää isänsä elinkaaren sisällä. Poikkeus: top-level-ikkunat (`QMainWindow` ilman parenttia) ja widgetit, jotka siirretään eksplisiittisesti toiseen ikkunaan. Code reviewissa epäilyttävä merkki on `new QWidget()` ilman parenttia dialogin sisällä.

[Lue lisää](https://doc.qt.io/qt-6/objecttrees.html)

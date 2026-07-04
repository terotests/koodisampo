# QHBoxLayoutissa napit venyvät epätasaisesti ikkunan resize:ssä. Säädin?

## Tilanne

Työkalupalkissa kolme nappia vierekkäin:

```cpp
auto *layout = new QHBoxLayout(toolbar);
layout->addWidget(new QPushButton("Uusi"));
layout->addWidget(new QPushButton("Avaa"));
layout->addWidget(new QPushButton("Tallenna"));
```

Kun ikkunan leveys kasvaa, kaikki kolme nappia venyvät yhtä paljon — "Tallenna"-nappi venyy turhaan leveäksi ja näyttää oudolta.

## Ratkaisu

`addStretch()` ja `setStretchFactor()` jakavat tilan tarkoituksella layoutissa:

```cpp
auto *layout = new QHBoxLayout(toolbar);
layout->addWidget(new QPushButton("Uusi"));
layout->addWidget(new QPushButton("Avaa"));
layout->addWidget(new QPushButton("Tallenna"));
layout->addStretch(1);  // tyhjä tila oikeaan reunaan

// Tai jos keskimmäinen widget venyy:
layout->setStretch(0, 0);  // Uusi — kiinteä
layout->setStretch(1, 1);  // keskialue venyy
layout->setStretch(2, 0);  // Tallenna — kiinteä
```

Stretch factor ohjaa resize-käyttäytymistä — QBoxLayout.

## Käytännössä

Yhdistä stretch `sizePolicy`:n kanssa: napeille `QSizePolicy::Fixed` tai `Maximum`, venyville alueille `Expanding`. `addStretch()` on kätevä työntämään napit vasempaan reunaan ilman spacer-widgettiä.

[Lue lisää](https://doc.qt.io/qt-6/qboxlayout.html)

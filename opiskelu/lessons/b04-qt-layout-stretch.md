# QHBoxLayout: keskimmäinen widget pitäisi venyä, reunat kiinteät. Asetus?

## Tilanne

Hakupalkissa kolme osaa: vasen label, keskellä hakukenttä, oikealla nappi:

```cpp
auto *layout = new QHBoxLayout;
layout->addWidget(new QLabel("Hae:"));
layout->addWidget(m_searchEdit);
layout->addWidget(new QPushButton("Etsi"));
toolbar->setLayout(layout);
```

Ikkunan leveydessä kaikki kolme venyvät — label ja nappi venyvät turhaan, hakukenttä ei saa ylimääräistä tilaa suhteessa muihin.

## Ratkaisu

`layout->setStretch(1, 1)` — stretch factor keskimmäiselle:

```cpp
auto *layout = new QHBoxLayout;
layout->addWidget(new QLabel("Hae:"));       // index 0
layout->addWidget(m_searchEdit, 1);            // index 1, stretch = 1
layout->addWidget(new QPushButton("Etsi"));    // index 2

layout->setStretch(0, 0);  // label kiinteä
layout->setStretch(1, 1);  // hakukenttä venyy
layout->setStretch(2, 0);  // nappi kiinteä
```

Stretch factor jakaa ylimääräisen tilan — QBoxLayout docs. Indeksi vastaa `addWidget`-järjestystä.

## Käytännössä

`addWidget(widget, stretch)` on lyhyempi tapa kuin erillinen `setStretch`. Varmista että kiinteillä widgeteillä on `QSizePolicy::Fixed` tai `Maximum`, jos ne silti venyvät odottamattomasti.

[Lue lisää](https://doc.qt.io/qt-6/qboxlayout.html#setStretch)

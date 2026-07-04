# QFormLayoutissa label venyy turhaan ikkunan leveydessä — input-kenttä jää kapeaksi. Korjaus?

## Tilanne

Asetuslomakkeessa `QFormLayout` jakaa tilan tasan:

```cpp
auto *form = new QFormLayout(settingsPage);
form->addRow("Palvelimen osoite:", m_hostEdit);
form->addRow("Portti:", m_portEdit);
```

Ikkunan leveydessä label-sarake venyy valtavaksi ja `QLineEdit`-kentät jäävät kapeiksi oikeaan reunaan.

## Ratkaisu

`setSizePolicy(Fixed/Preferred)` labelille tai stretch oikein QFormLayoutissa:

```cpp
auto *hostLabel = new QLabel("Palvelimen osoite:");
hostLabel->setSizePolicy(QSizePolicy::Fixed, QSizePolicy::Preferred);

form->addRow(hostLabel, m_hostEdit);

// Tai rajoita label-sarakkeen leveys:
form->setFieldGrowthPolicy(QFormLayout::ExpandingFieldsGrow);
form->setLabelAlignment(Qt::AlignRight | Qt::AlignVCenter);

m_hostEdit->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Fixed);
```

QSizePolicy ohjaa layoutin jakoa — Qt Widget docs.

## Käytännössä

`QFormLayout::AllNonFixedFieldsGrow` vs `ExpandingFieldsGrow` — valitse growth policy lomakkeen tyypin mukaan. Pitkissä labeleissa harkitse `addRow(widget, field)` widgetin sijaan string-labelia, jotta saat size policy -kontrollin.

[Lue lisää](https://doc.qt.io/qt-6/qsizepolicy.html)

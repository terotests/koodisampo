# Ikkuna resize aiheuttaa widgettien päällekkäisyyden. Mikä layout-manager korjaa?

## Tilanne

Dashboard-näkymässä widgetit on sijoitettu absoluuttisesti:

```cpp
chartWidget->setGeometry(0, 0, 400, 300);
tableWidget->setGeometry(0, 280, 400, 200);  // päällekkäin pienellä ikkunalla
statsWidget->setGeometry(410, 0, 200, 480);
```

Kun käyttäjä pienentää ikkunan korkeutta, kaavio ja taulukko menevät päällekkäin. Resize ei uudelleenaseta mitään.

## Ratkaisu

`QVBoxLayout` / `QHBoxLayout` / `QGridLayout` — automaattinen uudelleenasettelu:

```cpp
auto *mainLayout = new QHBoxLayout(centralWidget);

auto *leftCol = new QVBoxLayout;
leftCol->addWidget(chartWidget, 2);
leftCol->addWidget(tableWidget, 1);

mainLayout->addLayout(leftCol, 3);
mainLayout->addWidget(statsWidget, 1);
```

Layout managers handle resize — Qt Layout Management. `QGridLayout` sopii ruudukkomaisiin dashboardeihin.

## Käytännössä

`QSplitter` yhdistää käyttäjän säädettävät paneelit ja layoutin resize-logiikan. Testaa minimikoko (`setMinimumSize`) — layout ei voi taikoa tilaa, jota ikkunassa ei ole.

[Lue lisää](https://doc.qt.io/qt-6/layout.html)

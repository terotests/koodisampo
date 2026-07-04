# Wizard-UI: useita sivuja yhdessä ikkunassa — vain yksi näkyvissä kerrallaan. Widget?

## Tilanne

Asennusvelho sisältää kolme vaihetta: tervetuloa, asetukset ja yhteenveto. Jokaisella on oma layout, mutta ne jakavat saman ikkunan kehyksen ja navigaationapin ("Seuraava" / "Edellinen").

```cpp
// Väärä tapa: show/hide useita sibling-widgettejä
m_welcomePage->hide();
m_settingsPage->show();  // layout-säätö manuaalisesti
```

## Ratkaisu

`QStackedWidget` — `setCurrentIndex` vaihtaa wizard-sivua yhdessä ikkunassa:

```cpp
auto *stack = new QStackedWidget(this);
stack->addWidget(new WelcomePage);
stack->addWidget(new SettingsPage);
stack->addWidget(new SummaryPage);

connect(nextBtn, &QPushButton::clicked, this, [stack, this]() {
    const int next = stack->currentIndex() + 1;
    if (next < stack->count())
        stack->setCurrentIndex(next);
});

connect(backBtn, &QPushButton::clicked, stack, [stack]() {
    stack->setCurrentIndex(stack->currentIndex() - 1);
});
```

QStackedWidget stacks pages — one visible — Qt widgets.

## Käytännössä

Tallenna wizard-tila (`currentIndex`) ennen validointia — estä "Seuraava" jos nykyinen sivu on virheellinen. `QWizard` on valmis korkeamman tason vaihtoehto, jos et tarvitse täyttä custom-layoutia. Signaali `currentChanged(int)` päivittää navigaationappien tilan.

[Lue lisää](https://doc.qt.io/qt-6/qstackedwidget.html)

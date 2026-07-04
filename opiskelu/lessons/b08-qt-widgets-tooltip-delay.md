# Tooltip tulee liian hitaasti QA-testaajille. Mitä Qt-sovelluksessa säädät?

## Tilanne

Toolbar-napeissa on `setToolTip("Tallenna tiedosto")`, mutta tooltip ilmestyy vasta noin sekunnin viiveellä. QA-testaajat valittavat, etteivät ehdi nähdä vihjetta nopeissa hover-testeissä. Tuotannossa viive tuntuu hitaalta käytettävyystestauksessa.

```cpp
saveBtn->setToolTip("Tallenna (Ctrl+S)");
// Oletusviive ~700–1000 ms — alustakohtainen
```

## Ratkaisu

`QApplication` style/toolTipDuration tai platform theme — säädä showDelay:

```cpp
// Qt 5.14+ / Qt 6 — globaali tooltip-viive
QApplication::setEffectEnabled(Qt::UIEffect::UI_AnimateTooltip, false);

// Tyylin kautta (Fusion, jne.):
if (auto *style = qApp->style()) {
    style->polish(qApp);
}

// Suora asetus yksittäiselle widgetille — näytä heti:
saveBtn->setToolTipDuration(5000);  // näkyy 5 s
QToolTip::showText(saveBtn->mapToGlobal(QPoint(0, 0)), saveBtn->toolTip());

// Tai stylesheet / platform config:
// QT_TOOLTIP_DELAY=200 ympäristömuuttujalla (Linux)
```

Tool tip behavior via style/platform — QToolTip docs. `QToolTip::setFont` ja custom tooltip-widget (`setToolTip` + rich text) auttavat monimutkaisemmissa tapauksissa.

## Käytännössä

Liian lyhyt viive häiritsee — 200–300 ms on hyvä kompromissi testattavuudelle. Statusbar-viesti (`statusBar()->showMessage(...)`) on vaihtoehto pitkille ohjeille. Automatisoiduissa UI-testeissä älä luota tooltip-aikoihin — käytä `objectName`:ä tai `accessibleName`:ä.

[Lue lisää](https://doc.qt.io/qt-6/qtooltip.html)

# Tooltip tulee liian hitaasti QA-testaajille. Mitä Qt-sovelluksessa säädät?

## Tilanne

Toolbar-napeissa on `setToolTip("Tallenna tiedosto")`, mutta tooltip ilmestyy vasta noin sekunnin viiveellä. QA-testaajat valittavat, etteivät ehdi nähdä vihjetta nopeissa hover-testeissä. Tuotannossa viive tuntuu hitaalta käytettävyystestauksessa.

```cpp
saveBtn->setToolTip("Tallenna (Ctrl+S)");
// Oletusviive ~700–1000 ms — alustakohtainen
```

## Ratkaisu

Tooltipin ilmestymisviive tulee tyylin style hintistä `QStyle::SH_ToolTip_WakeUpDelay`. Säädä se `QProxyStyle`-aliluokalla:

```cpp
class FastTooltipStyle : public QProxyStyle {
public:
    using QProxyStyle::QProxyStyle;
    int styleHint(StyleHint hint, const QStyleOption *opt = nullptr,
                  const QWidget *w = nullptr,
                  QStyleHintReturn *ret = nullptr) const override {
        if (hint == QStyle::SH_ToolTip_WakeUpDelay)
            return 200;   // ms
        return QProxyStyle::styleHint(hint, opt, w, ret);
    }
};

// main():
app.setStyle(new FastTooltipStyle);
```

`setToolTipDuration()` säätää vain sitä, kuinka kauan tooltip pysyy näkyvissä — ei ilmestymisviivettä. `QToolTip::showText()` näyttää tooltipin heti omasta tapahtumankäsittelijästä, jos tarvitset täyden kontrollin.

## Käytännössä

Liian lyhyt viive häiritsee — 200–300 ms on hyvä kompromissi testattavuudelle. Statusbar-viesti (`statusBar()->showMessage(...)`) on vaihtoehto pitkille ohjeille. Automatisoiduissa UI-testeissä älä luota tooltip-aikoihin — käytä `objectName`:ä tai `accessibleName`:ä.

[Lue lisää](https://doc.qt.io/qt-6/qtooltip.html)

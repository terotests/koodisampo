# Pitkäkestoinen työ jumittaa UI:n. Qt-tyylinen ratkaisu QObjectille?

## Tilanne

Desktop-sovelluksessa käyttäjä painaa *Analysoi* — 30 sekunnin laskenta ajetaan suoraan napin slottimetodissa:

```cpp
void MainWindow::onAnalyzeClicked() {
    AnalysisResult result = runHeavyAnalysis(m_dataset);  // UI jäätyy
    showResult(result);
}
```

Ikkuna ei vastaa, spinneri ei pyöri ja käyttäjä luulee sovelluksen kaatuneen. `QApplication::processEvents()` auttaa hetkellisesti, mutta ei ratkaise ongelmaa.

Qt-sovelluksissa pitkä työ kuuluu pois GUI-säikeestä.

## Ratkaisu

Siirrä työntekijä-`QObject` worker-säikeeseen `moveToThread`:lla ja kommunikoi signaaleilla:

```cpp
// käynnistys GUI-säikeessä
m_thread = new QThread(this);
m_worker = new AnalysisWorker;
m_worker->moveToThread(m_thread);

connect(m_thread, &QThread::started, m_worker, &AnalysisWorker::process);
connect(m_worker, &AnalysisWorker::finished, this, &MainWindow::showResult);
connect(m_worker, &AnalysisWorker::finished, m_thread, &QThread::quit);

m_thread->start();
```

Worker-QObject omalla säikeellä — UI pysyy responsiivisena. Worker-object threadissä on Qt:n suositeltu malli.

## Käytännössä

Älä peri `QThread`:iä ja override `run()`:ia GUI-logiikalla — käytä worker-objektia. Tuhoa worker `deleteLater`:lla threadin `finished`-signaalissa. Näytä edistyminen signaaleilla `Qt::QueuedConnection`:illa.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

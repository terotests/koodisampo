# Raskas laskenta jäädyttää GUI-threadin. Qt-idiomi taustatyölle?

## Tilanne

Äänieditori normalisoi 10 minuutin raidat reaaliaikaisen waveformin generoinnin yhteydessä:

```cpp
void WaveformView::loadFile(const QString &path) {
    QVector<float> samples = decodeAndNormalize(path);  // GUI-säie, 8 s
    renderWaveform(samples);
}
```

Käyttöliittymä jäätyy, `QAudioOutput` pätkii ja käyttäjä luulee sovelluksen jumittuneen.

## Ratkaisu

Worker `QObject moveToThread(QThread)` — signaalit takaisin GUI-säikeeseen:

```cpp
class AudioLoader : public QObject {
    Q_OBJECT
public slots:
    void load(const QString &path) {
        auto samples = decodeAndNormalize(path);
        emit loaded(samples);
    }
signals:
    void loaded(const QVector<float> &samples);
};

m_loader->moveToThread(m_loadThread);
connect(this, &WaveformView::fileSelected, m_loader, &AudioLoader::load);
connect(m_loader, &AudioLoader::loaded, this, &WaveformView::renderWaveform,
        Qt::QueuedConnection);
m_loadThread->start();
```

moveToThread pattern — Qt Thread Support.

## Käytännössä

Suuret `QVector`-payloadit: harkitse `QSharedPointer<const Samples>` signaalissa välttääksesi kopioinnin. Näytä latausindikaattori heti — piilota vasta `loaded`-signaalissa.

[Lue lisää](https://doc.qt.io/qt-6/threads-technologies.html)

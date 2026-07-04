# Pitää ajaa raskas laskenta ilman UI-jäätymistä. Qt-rakenne?

## Tilanne

Tilastosovellus suorittaa Monte Carlo -simulaation 100 000 iteraatiolla. Nykyinen toteutus:

```cpp
void SimWindow::runSimulation() {
    for (int i = 0; i < 100000; ++i) {
        m_results[i] = iterate();
        ui->progressBar->setValue(i);  // hidastaa + GUI-säie
    }
}
```

UI jäätyy koko simulaation ajaksi. Kehittäjä harkitsee `QThread`-luokan perimistä ja `run()`-overridea.

## Ratkaisu

Käytä worker-objektia `moveToThread(QThread*)` — älä override `QThread::run()` GUI-logiikalla:

```cpp
class SimWorker : public QObject {
    Q_OBJECT
public slots:
    void run(int iterations) {
        for (int i = 0; i < iterations; ++i) {
            m_results[i] = iterate();
            if (i % 1000 == 0) emit progress(i);
        }
        emit finished(m_results);
    }
signals:
    void progress(int value);
    void finished(const QVector<double> &results);
};

m_worker->moveToThread(m_thread);
connect(m_thread, &QThread::started, m_worker, [=]() { m_worker->run(100000); });
```

Worker object threadissä — Qt threading best practice.

## Käytännössä

`QThread::run()` on OK vain, jos worker ei tarvitse event loopia signaaleille. Worker-objektimalli skaalautuu paremmin useisiin tehtäviin samassa säikeessä. Progress-päivitykset signaaleilla `Qt::QueuedConnection`.

[Lue lisää](https://doc.qt.io/qt-6/thread-basics.html)

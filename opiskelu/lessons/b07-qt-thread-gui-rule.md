# Code review: QLabel::setText kutsutaan worker-threadista. Mikä sääntö rikkoutuu?

## Tilanne

Pull request sisältää:

```cpp
// filemonitorworker.cpp (worker-thread)
void FileMonitorWorker::notifyChange(const QString &file) {
    m_window->statusLabel()->setText(
        tr("Tiedosto muuttui: %1").arg(file));
}
```

Tekijä perustelee: "QString on immutable, joten tämä on turvallista." Review pyytää korjausta ennen mergeä.

## Ratkaisu

GUI-luokat vain main threadissä — Qt thread affinity -sääntö:

```cpp
void FileMonitorWorker::notifyChange(const QString &file) {
    emit fileChanged(file);
}

// mainwindow.cpp (GUI-thread)
connect(m_worker, &FileMonitorWorker::fileChanged,
        this, [this](const QString &file) {
    ui->statusLabel->setText(tr("Tiedosto muuttui: %1").arg(file));
}, Qt::QueuedConnection);
```

QObject thread affinity — GUI updates on owning thread. `QLabel` sisäinen tila ei ole suojattu säierajojen yli.

## Käytännössä

Code review -checklist: worker-luokat eivät saa sisältää widget-viittauksia. Käytä arkkitehtuuria, jossa worker on `QObject` ilman UI-riippuvuuksia. Static analyzer + grep `QWidget` worker-hakemistossa.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

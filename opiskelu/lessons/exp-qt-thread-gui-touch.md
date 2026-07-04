# Code review löytää `label->setText()` suoraan worker-threadista. Miksi tämä on kielletty?

## Tilanne

Latauspalvelussa worker päivittää tilan suoraan:

```cpp
void DownloadWorker::onProgress(qint64 bytes) {
    m_label->setText(QString("%1 kt").arg(bytes / 1024));  // worker-thread!
}
```

Code review kommentoi: "GUI-kutsu taustasäikeestä". Kehittäjä vastaa, että `QString` on thread-safe ja testit menevät läpi. Tuotannossa satunnaiset crashit ilmenevät kuormituksessa.

## Ratkaisu

`QWidget` on GUI-säikeen oma — toisesta säikeestä kutsu on UB (undefined behavior):

```cpp
void DownloadWorker::onProgress(qint64 bytes) {
    emit progressChanged(bytes / 1024);  // signaali GUI-säikeeseen
}

// MainWindow (GUI-säie):
void MainWindow::onProgressChanged(qint64 kilobytes) {
    ui->statusLabel->setText(QString("%1 kt").arg(kilobytes));
}
```

Qt GUI classes eivät ole thread-safe — vain main thread saa koskea. Thread affinity -sääntö koskee kaikkia `QObject`-perillisiä, joilla on GUI-side effects.

## Käytännössä

Aseta CI-sääntö: grep `setText|setPixmap|update|repaint` worker-luokista. Käytä `QMetaObject::invokeMethod(..., Qt::QueuedConnection)` tai signaaleja. Debug-buildissa `Q_ASSERT(qApp->thread() == widget->thread())`.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

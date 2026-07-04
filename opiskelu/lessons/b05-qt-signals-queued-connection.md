# Worker-säie emittoi signaalin joka päivittää GUI:ta — satunnainen crash. Korjaus?

## Tilanne

Kuvankäsittelysovelluksessa `ImageProcessor` pyörii worker-säikeessä. Valmistuttuaan se emitoi tuloksen:

```cpp
void ImageProcessor::process(const QImage &input) {
    QImage result = applyFilter(input);
    emit imageReady(result);
}
```

Pääikkuna näyttää tuloksen slottissa, joka kutsuu `QLabel::setPixmap()`. Kehitysvaiheessa testataan pienillä kuvilla — crash ilmenee vasta isolla resoluutiolla ja nopealla peräkkäisellä prosessoinnilla.

Worker-säie ja GUI-säie jakavat saman `AutoConnection`-yhteyden, joka ei aina jonota oikein jos connect tehdään ennen threadin siirtoa.

## Ratkaisu

Pakota `Qt::QueuedConnection` — slotti ajetaan GUI-säieessä:

```cpp
connect(processor, &ImageProcessor::imageReady,
        this, &MainWindow::showImage,
        Qt::QueuedConnection);
```

`Qt::QueuedConnection` — slot ajetaan GUI-säieessä. Cross-thread signals default to Queued — Qt signals/slots threading, mutta eksplisiittinen tyyppi poistaa epävarmuuden.

## Käytännössä

Connect aina vastaanottajan (GUI) säikeessä tai heti workerin luonnin jälkeen ennen `moveToThread()`. `QImage` on implisiittisesti kopioitavissa queued-yhteyksissä — varmista että custom-tyypit on rekisteröity `qRegisterMetaType`:lla.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html#signals-and-slots-across-threads)

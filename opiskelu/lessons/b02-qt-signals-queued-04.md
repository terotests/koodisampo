# Worker-thread emit updateUI() — crash GUI-threadissa. Connection type?

## Tilanne

Sensorisovelluksessa `SensorReader` lukee sarjaporttia worker-säikeessä ja emitoi päivityksen:

```cpp
void SensorReader::readLoop() {
    double value = readSensor();
    emit updateUI(value);
}
```

Pääikkuna on yhdistetty oletusyhteydellä:

```cpp
connect(reader, &SensorReader::updateUI,
        mainWindow, &MainWindow::refreshChart);
```

`refreshChart()` päivittää `QChartView`:n. Kehityskoneella testatessa kaikki näyttää toimivan, mutta tuotantokoneella satunnainen segfault ilmestyy profilerissa juuri `QWidget`-päivityksissä.

Ongelma on thread-affinity: slotti ajetaan lähettäjän säikeessä, ei GUI-säikeessä.

## Ratkaisu

Käytä `Qt::QueuedConnection` — se välittää signaalin oikeaan säikeeseen turvallisesti:

```cpp
connect(reader, &SensorReader::updateUI,
        mainWindow, &MainWindow::refreshChart,
        Qt::QueuedConnection);
```

`QueuedConnection` marshals event GUI-loopiin — Qt signals/slots threading. Slotti ajetaan vastaanottajan säikeessä, jossa `QChartView` on luotu.

## Käytännössä

Merkitse cross-thread connectit kommenteilla tai käytä wrapper-luokkaa, joka pakottaa oikean connection-tyypin. Testaa threading ASan/TSan-buildilla — satunnaiset crashit ilmenevät usein vasta kuormituksessa.

[Lue lisää](https://doc.qt.io/qt-6/threads-qobject.html)

# Worker-thread emit deleteLater() QObjectille joka elää GUI-threadissä — crash satunnaisesti. Miksi?

## Tilanne

Resurssienhallinnassa worker vapauttaa väliaikaisen objektin:

```cpp
void Worker::cleanup() {
    m_tempBuffer->deleteLater();  // luotu GUI-säikeessä
}
```

`TempBuffer` luotiin pääikkunassa ja elää GUI-säikeessä. `deleteLater()` worker-säikeestä postaa poistotapahtuman — mutta event loop, joka käsittelee sen, on väärässä säikeessä tai ei ole käynnissä oikeaan aikaan.

## Ratkaisu

`deleteLater` vaatii event loopin omistajasäikeessä — käytä queued delete tai siirrä objekti oikeaan threadiin:

```cpp
void Worker::cleanup() {
    QMetaObject::invokeMethod(m_tempBuffer, "deleteLater",
                              Qt::QueuedConnection);
}

// tai signaali GUI-säikeeseen:
emit requestDelete(m_tempBuffer);
// slot GUI-säieessä: buffer->deleteLater();
```

deleteLater postaa eventin — event loop pitää pyöriä oikeassa threadissä. Poisto tapahtuu vastaanottajan event loopissa seuraavan kierroksen aikana.

## Käytännössä

Objektin thread affinity määrää, missä säikeessä `deleteLater()` on turvallinen. GUI-objektit tuhoa aina GUI-säikeestä. Worker-säikeen objektit: `connect(thread, &QThread::finished, worker, &QObject::deleteLater)`.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#deleteLater)

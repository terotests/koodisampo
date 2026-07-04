# Producer-consumer queue Qt:llä — consumer odottaa dataa ilman busy-waitia. Primitiivi?

## Tilanne

Kuvankäsittelyputkessa tuottaja-säie lukee kameraa ja kuluttaja-säie prosessoi frameja:

```cpp
// consumer — nykyinen (väärä)
while (true) {
    if (!m_queue.isEmpty()) {
        Frame f = m_queue.dequeue();
        process(f);
    }
    // busy-wait — 100% CPU yhdellä ytimetä
}
```

CPU-käyttö on jatkuvasti 100 % yhdellä ytimetä, vaikka kamera tuottaa vain 30 fps. Tarvitaan tehokas odotus ilman spin-loopia.

## Ratkaisu

Käytä `QWaitCondition` + `QMutex` — wait/wakeOne producer-consumer -jonossa:

```cpp
// producer
void Producer::push(const Frame &f) {
    QMutexLocker lock(&m_mutex);
    m_queue.enqueue(f);
    m_condition.wakeOne();
}

// consumer
void Consumer::runLoop() {
    QMutexLocker lock(&m_mutex);
    while (m_running) {
        while (m_queue.isEmpty() && m_running)
            m_condition.wait(&m_mutex);  // vapauttaa CPU:n
        if (!m_running) break;
        Frame f = m_queue.dequeue();
        lock.unlock();
        process(f);
        lock.relock();
    }
}
```

QWaitCondition — Qt thread synchronization. `wait()` vapauttaa mutexin ja nukkuu kunnes `wakeOne()`/`wakeAll()`.

## Käytännössä

Qt:n korkeammalla tasolla harkitse `QSemaphore` tai signaali/slot-arkkitehtuuria worker-objektilla. `QWaitCondition` sopii lock-step queueihin, joissa tarvitset tarkan synkronoinnin. Aina pidä mutex lukittuna wait-kutsun aikana.

[Lue lisää](https://doc.qt.io/qt-6/qwaitcondition.html)

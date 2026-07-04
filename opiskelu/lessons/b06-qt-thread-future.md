# Pitkä laskenta taustalla — haluat tulos GUI:hin ilman raw threadia. Qt-ratkaisu?

## Tilanne

Hakusovellus laskee similarity-scoren 100 000 dokumentille. Kehittäjä haluaa välttää manuaalisen `QThread` + worker -boilerplaten:

```cpp
void SearchPanel::onSearch() {
    // nykyinen: UI jäätyy
    QVector<Score> results = computeScores(m_query, m_corpus);
    showResults(results);
}
```

Tarvitaan taustalaskenta ilman raakaa säiehallintaa, mutta tulos pitää saada GUI:hin turvallisesti.

## Ratkaisu

Käytä `QtConcurrent::run` + `QFutureWatcher` — future pattern taustalaskentaan:

```cpp
void SearchPanel::onSearch() {
    auto future = QtConcurrent::run([this]() {
        return computeScores(m_query, m_corpus);
    });

    auto *watcher = new QFutureWatcher<QVector<Score>>(this);
    connect(watcher, &QFutureWatcher<QVector<Score>>::finished, this, [this, watcher]() {
        showResults(watcher->result());
        watcher->deleteLater();
    });
    watcher->setFuture(future);
}
```

Qt Concurrent — Qt docs QFutureWatcher. `finished`-signaali toimitetaan watcherin säikeeseen (GUI) queued-yhteydellä.

## Käytännössä

`QtConcurrent` sopii puhtaaseen CPU-laskentaan ilman `QObject`-signaaleja työn aikana. Peruutus: `QFuture::cancel()`. Älä koske GUI:hin lambdassa — vain palauta data ja päivitä watcherin `finished`-slottissa.

[Lue lisää](https://doc.qt.io/qt-6/qtconcurrent-index.html)

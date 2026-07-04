# Miten jaat yksinkertaisen laskurin säikeiden välillä turvallisesti?

## Tilanne

Palvelu laskee käsiteltyjä pyyntöjä useasta worker-säikeestä:

```cpp
int requestCount = 0;

void worker() {
    while (running) {
        handleRequest();
        requestCount++;  // data race — UB
    }
}
```

Ilman synkronointia kaksi säiettä voi lukea saman arvon, kasvattaa sitä ja kirjoittaa takaisin — yksi incrementti katoaa. TSan (ThreadSanitizer) voi havaita tämän testeissä, mutta release-buildissa bugi on satunnainen: laskuri jää alitukseksi.

`mutex` yksinkertaiseen laskuriin toimii, mutta on raskas — jokainen `++` lukitsee.

## Ratkaisu

**`std::atomic<int>`** (tai `atomic<uint64_t>`):

```cpp
std::atomic<int> requestCount{0};

void worker() {
    while (running) {
        handleRequest();
        requestCount.fetch_add(1, std::memory_order_relaxed);
    }
}
```

Atomiset operaatiot ovat määritelty — ei data racea. Yksinkertaiseen laskuriin `memory_order_relaxed` riittää usein (ei synkronoi muita muuttujia). Oletus `memory_order_seq_cst` on turvallisin aloitus.

## Käytännössä

Älä käytä `volatile` synkronointiin — se ei takaa atomisuutta C++:ssa. Monimutkaisempi jaettu tila → mutex. CppCoreGuidelines CP.2: "Minimize explicit sharing of writable data."

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/atomic)

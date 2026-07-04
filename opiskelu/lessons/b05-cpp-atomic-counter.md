# Usea säie päivittää jaettua laskuria. Mikä primitiivi on oikea ilman mutexia yksinkertaiseen incrementiin?

## Tilanne

Request-laskuri:

```cpp
int count = 0;
void handler() { ++count; }  // data race
```

Mutex jokaiselle incrementille on raskas — lukitus kilpailusta, context switch. Yksinkertaiseen laskuriin tarvitaan kevyempi primitiivi, joka on silti määritelty C++-standardissa.

## Ratkaisu

**`std::atomic<int>`**:

```cpp
std::atomic<int> count{0};
void handler() { count.fetch_add(1, std::memory_order_relaxed); }
```

Atomiset operaatiot eliminoivat data racen. `relaxed` riittää pelkkään laskuriin — ei synkronoi muita muuttujia. Oletus `seq_cst` on turvallisin aloitus.

## Käytännössä

Monimutkaisempi jaettu tila → mutex. `-stdatomic` hardware-tuki. CppCoreGuidelines CP.2. Älä `volatile` synkronointiin.

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/atomic)

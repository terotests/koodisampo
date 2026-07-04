# Laskuri kasvaa useasta säikeestä — `atomic<int>++` riittääkö ilman memory_order?

## Tilanne

```cpp
std::atomic<int> counter{0};
counter++;  // oletus memory_order
```

Yksinkertaiseen laskuriin `++` riittää usein. Mutta **oletus on `memory_order_seq_cst`** — vahvin, hitain. Relaxed riittää jos laskuri ei synkronoi muuta dataa.

## Ratkaisu

**`seq_cst` oletus** — turvallisin aloitus. **`relaxed`** vain kun semantiikka sallii:

```cpp
counter.fetch_add(1, std::memory_order_relaxed);
```

Jos laskuri signaloi "data ready" toiselle säikeelle → tarvitset **release/acquire** parin.

## Käytännössä

Älä optimoi memory_orderia ilman mittausta ja ymmärrystä. CppCoreGuidelines CP.2. Dokumentoi miksi relaxed riittää.

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/memory_order)

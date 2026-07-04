# Laskuri kasvaa useassa säikeessä — atomic<int> riittää, mutta luku ei näy heti toisessa CPU:ssa. Mikä voi auttaa?

## Tilanne

Flag + data ilman orderingia — consumer näkee flagin ennen dataa tai vanhaa dataa. Pelkkä `atomic` oletus ei aina riitä **visibility**-synkronointiin.

## Ratkaisu

Valitse **memory order** tarpeen mukaan:

- **`seq_cst`** — oletus, turvallisin, hitain
- **`release`/`acquire`** — producer/consumer data + flag
- **`relaxed`** — pelkkä laskuri, ei synkronoi muuta

```cpp
flag.store(true, std::memory_order_release);
if (flag.load(std::memory_order_acquire)) { /* data visible */ }
```

## Käytännössä

Älä optimoi ilman mittausta. CppCoreGuidelines CP.2. Dokumentoi ordering-sopimus.

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/memory_order)

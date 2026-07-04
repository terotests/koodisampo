# Lock-free jonossa tuottaja kirjoittaa datan ja asettaa flagin — kuluttaja näkee vanhaa dataa. Mikä memory order?

## Tilanne

```cpp
Data slot;
std::atomic<bool> ready{false};

// producer
slot = data;
ready.store(true, ???);

// consumer
if (ready.load(???)) use(slot);  // slot voi olla vanhaa
```

Ilman oikeaa orderingia consumer näkee `ready=true` ennen kuin `slot` on näkyvissä.

## Ratkaisu

**Release-acquire** pari:

```cpp
// producer
slot = data;
ready.store(true, std::memory_order_release);

// consumer
if (ready.load(std::memory_order_acquire)) use(slot);
```

Release synkronoi kirjoitukset ennen flagia. Acquire näkee ne consumerissa.

## Käytännössä

Yksinkertainen laskuri: relaxed voi riittää. Data + flag: release/acquire. CppCoreGuidelines CP.2.

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/memory_order)

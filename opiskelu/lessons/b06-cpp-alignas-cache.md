# Hot loop kärsii cache miss — kaksi counteria samassa cache line:ssä eri threadeilla. Mitä kokeilla?

## Tilanne

```cpp
struct Stats {
    std::atomic<uint64_t> requests;
    std::atomic<uint64_t> errors;
};  // vierekkäin — sama cache line 64 B
```

Eri säikeet päivittävät eri laskureita — CPU invalidoi cache linen turhaan (**false sharing**). Suorituskyky romahtaa.

## Ratkaisu

**`alignas(64)`** erottaa laskurit:

```cpp
struct alignas(64) PaddedCounter {
    std::atomic<uint64_t> value{0};
};
PaddedCounter requests;
PaddedCounter errors;
```

C++17: `std::hardware_destructive_interference_size`. Mittaa profiloijalla ennen/jälkeen.

## Käytännössä

False sharing harvinainen mutta vaikea löytää. CppBestPractices Performance. Vältä liikaa paddingia — cache footprint kasvaa.

[Lue lisää](https://en.cppreference.com/w/cpp/language/alignas)

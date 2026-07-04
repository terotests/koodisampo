# Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa?

## Tilanne

Mittarirakenne:

```cpp
struct Metrics {
    std::atomic<uint64_t> requests;
    std::atomic<uint64_t> errors;
};
```

Säie A kasvattaa `requests`, säie B kasvattaa `errors` — eri muuttujat, ei näennäistä kilpailua. Silti profiloija näyttää cache miss -myrskyn ja skaalautuvuus on heikko.

## Ongelma: false sharing

Kaksi atomista mahtuu samalle **cache line**lle (tyypillisesti 64 tavua). Kun yksi säie kirjoittaa, CPU invalidoi koko linen muille ytimille — vaikka toinen säie koskettaa eri muuttujaa.

## Ratkaisu

Erota laskurit toisistaan cache line -rajalle:

```cpp
struct alignas(64) Metrics {
    std::atomic<uint64_t> requests;
    char pad[64 - sizeof(std::atomic<uint64_t>)];
    std::atomic<uint64_t> errors;
};
```

Tai käytä `alignas(64)` jokaiselle hot counterille erillisessä structissa. Tavoite: eri säikeiden päivitykset osuvat eri cache lineihin.

## Huomio

`alignas` lisää muistia — käytä vain mitattuun ongelmaan. Liian suuri padding joka paikassa hidastaa muistia. Profiloi ennen ja jälkeen.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rrh-cache)

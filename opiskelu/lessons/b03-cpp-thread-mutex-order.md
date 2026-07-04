# Deadlock kahdessa mutexissa: thread A lukitsee m1→m2, thread B m2→m1. Miten estät?

## Tilanne

Kaksi säiettä päivittää jaettuja tilastoja kahden mutexin takana. Säie 1: `lock(stats_mutex); lock(cache_mutex);`. Säie 2: `lock(cache_mutex); lock(stats_mutex);`. Kuormitus on matala kehityksessä — deadlock näkyy vasta tuotannossa, kun kaksi requestia osuu samaan aikaan.

Ongelma ei ole mutexit itsessään vaan **epäjohdonmukainen lukitusjärjestys**.

## Ratkaisu

Kolme käytännön tapaa:

1. **`std::scoped_lock(m1, m2)`** (C++17) — standardikirjasto lukitsee mutexit turvallisessa järjestyksessä riippumatta kutsujärjestyksestä.
2. **Kiinteä järjestys** — dokumentoi ja pakota: aina `stats_mutex` ennen `cache_mutex` kaikissa säikeissä.
3. **Vähemmän lukituksia** — yhdistä suojattu data yhden mutexin taakse tai käytä lock-free-rakennetta, jos profilointi osoittaa tarpeen.

```cpp
void updateStatsAndCache() {
    std::scoped_lock lock(stats_mutex, cache_mutex);
    // molemmat resurssit suojattu
}
```

## Huomio

`scoped_lock` ei korvaa hierarkiaa monimutkaisissa järjestelmissä (kolme+ mutexia eri kombinaatioissa). Silloin lock ordering -dokumentaatio tai lock hierarchy -pattern on pakollinen.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#CP43)

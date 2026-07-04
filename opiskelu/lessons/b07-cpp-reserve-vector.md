# Silmukka push_backaa miljoona elementtiä — profileri näyttää toistuvia allokaatioita. Ensimmäinen optimointi?

## Tilanne

Data kerätään silmukassa:

```cpp
std::vector<Record> records;
for (int i = 0; i < 1'000'000; ++i) {
    records.push_back(fetch(i));
}
```

`vector` kasvaa eksponentiaalisesti — jokainen kapasiteetin ylitys kopioi kaikki elementit uuteen bufferiin. Profiloija näyttää tuhansia `realloc`/`memcpy` kutsuja. Suurin osa ajasta menee allokaatioon, ei `fetch`:iin.

## Ratkaisu

**`records.reserve(1'000'000)`** ennen silmukkaa:

```cpp
std::vector<Record> records;
records.reserve(1'000'000);
for (int i = 0; i < 1'000'000; ++i) {
    records.push_back(fetch(i));
}
```

`reserve` varaa kapasiteetin kerralla — ei uudelleenallokaatiota kasvun aikana (kunnes ylität varauksen).

## Käytännössä

Arvioi koko etukäteen tai `source.size()`. Sama `string::reserve` merkkijonon kasvattamiseen. Mittaa ennen/jälkeen — halpa kokeilla. CppBestPractices Performance: reserve on ensimmäinen vipu ennen algoritmivaihtoa.

[Lue lisää](https://en.cppreference.com/w/cpp/container/vector/reserve)

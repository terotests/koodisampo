# Profilointi näyttää tuhansia vector-reallokaatioita request-käsittelyssä. Ensimmäinen korjaus?

## Tilanne

Jokainen HTTP-request:

```cpp
std::vector<Event> events;
while (parseNext(ev)) {
    events.push_back(ev);
}
```

Arvio: keskimäärin 500 eventtiä/request — vector aloittaa pienestä ja reallokoi ~10 kertaa per request. 10k req/s → massiivinen allokaatiokuorma.

## Ratkaisu

**`events.reserve(estimatedCount)`** ennen silmukkaa:

```cpp
events.reserve(512);  // tai profiloitu keskiarvo
```

Yksi allokaatio per request. Mittaa `reserve`-koon tuotantologeista.

## Käytännössä

Incident-response: reserve on ensimmäinen vipu ennen algoritmivaihtoa. Object pool jos vector kierrätetään. CppBestPractices Performance.

[Lue lisää](https://en.cppreference.com/w/cpp/container/vector/reserve)

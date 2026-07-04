# Miksi `for (int i = 0; i < v.size(); i++)` voi olla vaarallinen?

## Tilanne

Indeksisilmukka vektorin yli on arkinen koodi. `v.size()` on `size_t` (unsigned 64/32-bit). Indeksi `i` on usein `int`. Vertailu `i < v.size()` tekee implisiittisen muunnoksen.

Jos vektori on tyhjä ja logiikka käyttää `int i` negatiivisena sentinel-arvona, tai jos koko ylittää `INT_MAX`, käyttäytyminen yllättää. Yleisin ongelma: **signed/unsigned vertailu** piilossa jokaisessa `i < container.size()` -rivissä.

## Ratkaisu

```cpp
// 1. range-for — ei indeksivirheitä
for (const auto& x : v) { use(x); }

// 2. size_t indeksi
for (size_t i = 0; i < v.size(); ++i) { use(v[i]); }

// 3. C++20
for (size_t i = 0; i < std::ssize(v); ++i) { ... }
```

`std::ssize` palauttaa signed size — hyödyllinen kun tarvitset signed-indeksin ja haluat välttää `-Wsign-compare`-varoituksia tietoisesti.

## Käytännössä

Sama teema kuin `b05-cpp-signed-compare-bug` — tämä kysymys painottaa peruskysymystä "miksi vaarallinen", ei tiettyä bugitapausta.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-mix)

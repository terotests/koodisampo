# Silmukka käy std::map:in läpi: `for (auto& p : map) { auto k = p.first; auto v = p.second; }`. Modernisointi?

## Tilanne

Konfiguraatiomapin käsittely näyttää tältä:

```cpp
for (const auto& entry : config) {
    const std::string& key = entry.first;
    int value = entry.second;
    apply(key, value);
}
```

`.first` ja `.second` eivät kerro domain-semantiikkaa — lukija tarkistaa aina pairin järjestyksen. Sama toistuu `unordered_map`, RPC-vastauksissa ja `std::pair`-palauttavissa API:issa. Kirjoitusvirhe (`second` vs `first`) kääntyy mutta tuottaa väärää konfiguraatiota.

## Ratkaisu

**Structured bindings** (C++17):

```cpp
for (const auto& [key, value] : config) {
    apply(key, value);
}
```

Nimet valitaan domainin mukaan (`[host, port]`, `[userId, score]`). Intentio on heti luettavissa ilman pair-tietoa.

## Käytännössä

Prefer structured bindings kaikissa map/tuple-silmukoissa uudessa koodissa. Varo elinikää: `auto [k, v] = *it` iteratorista ok viittauksella; `auto [x] = factory()` kopioi jos ei `const auto&`. CppCoreGuidelines: readable decomposition over positional access.

[Lue lisää](https://en.cppreference.com/w/cpp/language/structured_binding)

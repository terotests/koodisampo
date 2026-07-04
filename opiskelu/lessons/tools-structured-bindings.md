# C++17: miten purat `std::map`-iteratorin avain/arvo-pairin siististi?

## Tilanne

Map-silmukka on verbose:

```cpp
for (const auto& entry : config) {
    const std::string& key = entry.first;
    int value = entry.second;
    apply(key, value);
}
```

`.first` / `.second` eivät kerro semantiikkaa. Sama toistuu `unordered_map`, `multimap` ja `pair`-palauttavissa API:issa. Lukija tarkistaa aina kumpi on avain ja kumpi arvo.

## Ratkaisu

**Structured bindings** (C++17):

```cpp
for (const auto& [key, value] : config) {
    apply(key, value);
}

// iterator explicitly:
for (auto it = config.begin(); it != config.end(); ++it) {
    const auto& [k, v] = *it;
    apply(k, v);
}
```

Nimet valitaan domainin mukaan (`[userId, score]`). Toimii myös `tuple`, struct (public jäsenet) ja array.

## Käytännössä

Prefer structured bindings map/tuple-silmukoissa. Varo: `auto [x, y] = getPair()` **kopioi** jos ei viitata — käytä `const auto& [x, y] = ...` kun lähde on olemassa. CppCoreGuidelines: readable decomposition.

[Lue lisää](https://en.cppreference.com/w/cpp/language/structured_binding)

# Koodi purkaa `std::pair<int,std::string>` käsin `.first` ja `.second`. Moderni tapa?

## Tilanne

Map-silmukka näyttää tältä:

```cpp
for (const auto& row : userMap) {
    int id = row.first;
    const std::string& name = row.second;
    process(id, name);
}
```

`.first` ja `.second` eivät kerro semantiikkaa — lukija joutuu muistamaan pairin järjestyksen. Sama toistuu `tuple`, `optional`-parien ja API:n palauttaman `pair`:in kanssa. Kirjoitusvirhe (`row.second` vs `row.first`) kääntyy mutta tuottaa väärää dataa.

## Ratkaisu

**Structured bindings** (C++17):

```cpp
for (const auto& [id, name] : userMap) {
    process(id, name);
}

auto [ok, value] = parse(input);
if (ok) use(value);
```

Nimet kertovat intentin. Toimii `pair`, `tuple`, structeille (jäsenjärjestyksessä) ja C-array:lle.

## Käytännössä

Prefer structured bindings uudessa koodissa map/tuple-silmukoissa. Vanha `.first`/`.second` säilyy legacyssä. Varo elinikää: `auto& [key, val] = *it` mapissa ok; `auto [x] = getTemp()` kopioi jos ei viitata. CppCoreGuidelines: readable names over positional access.

[Lue lisää](https://en.cppreference.com/w/cpp/language/structured_binding)

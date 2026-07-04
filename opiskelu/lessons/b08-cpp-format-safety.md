# Logitus käyttää sprintf-puskuria — satunnainen overflow tuotannossa. Korvaava standardikirjasto?

## Tilanne

```cpp
char buf[128];
sprintf(buf, "user=%s size=%d", name, size);  // overflow riski
```

Kiinteä puskuri + formaattivirhe = UB. Tuotantobugi harvinaisella inputilla.

## Ratkaisu

**`std::format`** (C++20) tai **`ostringstream`**:

```cpp
auto msg = std::format("user={} size={}", name, size);
```

Automaattinen kasvu, tyyppitarkistus. Ei kiinteää pinopuskuria.

## Käytännössä

Poista sprintf tuotantopolulta. `{fmt}` ennen C++20. CppBestPractices Safety.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/format/format)

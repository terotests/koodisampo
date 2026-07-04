# Funktio ottaa (T* data, size_t len) — tuotannossa buffer overflow. Mikä moderni tyyppi?

## Tilanne

```cpp
void parse(const uint8_t* data, size_t len) {
    readU32(data);  // 4 tavua — len voi olla 1
}
```

Osoitin + erillinen pituus — kutsuja voi välittää väärän parin. Funktio ei voi tarkistaa rajoja tyyppitasolla.

## Ratkaisu

**`std::span<const uint8_t>`**:

```cpp
void parse(std::span<const uint8_t> data) {
    if (data.size() < 4) throw ParseError{};
    auto word = readU32(data.subspan(0, 4));
}
```

Koko aina mukana — `size()`, `subspan()`, bounds check.

## Käytännössä

Korvaa legacy `(ptr, len)` spanilla. C++20 standardi. CppBestPractices Safety.

[Lue lisää](https://en.cppreference.com/w/cpp/container/span)

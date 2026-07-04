# Tuotantobugi: funktio ottaa `(uint8_t* data, size_t len)` ja lukee yli puskurin. Miten rajapinta turvataan C++20-tyylillä?

## Tilanne

Binary parser:

```cpp
void parse(const uint8_t* data, size_t len) {
    uint32_t magic = readU32(data);  // lukee 4 tavua — len voi olla 2
}
```

Osoitin + erillinen pituus — kutsuja voi välittää väärän `len`:in. Funktio ei voi tarkistaa rajoja tyyppitasolla. Buffer overrun tuotannossa — turvallisuusaukko.

## Ratkaisu

**`std::span<const uint8_t>`** — koko kulkee mukana:

```cpp
void parse(std::span<const uint8_t> data) {
    if (data.size() < 4) throw ParseError("too short");
    uint32_t magic = readU32(data.subspan(0, 4));
}
```

`span::size()`, `subspan()` — rajat tarkistettavissa. Ei erillistä pituusparametria, joka voi olla väärä.

## Käytännössä

CppBestPractices Safety: korvaa `(ptr, len)` spanilla. Legacy: `parse({ptr, len})`. C++20 standardi. Yhdistä bounds check ennen jokaista lukua.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md)

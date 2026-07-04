# Legacy-funktio ottaa `int buf[256]` ja kutsuja antaa pienemmän pinon. Miten modernisoit rajapinnan?

## Tilanne

Legacy-API:

```cpp
void process(int buf[256]);  // decay → int* — 256 katoaa

int small[64];
process(small);  // UB — funktio lukee 256 elementtiä
```

C-taulukko parametrina ei kulje kokoa. Kutsuja ja funktio voivat olettaa eri pituuksia — buffer overrun tuotannossa.

## Ratkaisu

Kiinteä koko → **`std::array<int, 256>`**; dynaaminen näkymä → **`std::span<int>`**:

```cpp
void process(std::span<int> buf) {
    assert(buf.size() >= required);
    // buf.size() aina saatavilla
}

std::array<int, 256> fixed{};
process(fixed);

int small[64];
process(std::span<int>(small));  // size 64 — funktio näkee
```

Koko on osa API-sopimusta tai tarkistettavissa runtime.

## Käytännössä

CppBestPractices Safety: korvaa `T[]` ja `T*+len` uudessa koodissa. Legacy wrapper: `process(std::span<int>(buf, 256))` sisäisesti. C++20 `span` on standardiratkaisu.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md)

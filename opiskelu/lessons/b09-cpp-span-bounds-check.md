# Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni korvaava tyyppi rajattuun näkymään?

## Tilanne

Legacy-funktio `void parse(const char* data)` olettaa NUL-päättyvän merkkijonon. Kutsuja välittää binääripuskurin, jossa on sisäisiä nollatavuja tai ei NUL-päätettä lainkaan — `strlen` tai `strcpy` lukee yli bufferin. Toinen variantti: `void read(const char* buf, size_t len)` on parempi, mutta kutsujat sekoittavat pituuden ja osoitteen eri parametreihin.

Ongelma on API-muodossa: osoitin yksin ei kerro rajoja. Pituus on erillinen parametri, joka helposti jää vääräksi refaktoroinnissa.

## Ratkaisu

Korvaa rajaton osoitin tyypillä, joka kantaa pituuden mukana — `std::span<const char>` tai `std::span<const std::byte>`:

```cpp
void parse(std::span<const char> data) {
    for (char c : data) { /* ei ylitä data.size() */ }
}
```

`span` on non-owning näkymä tunnettuun alueeseen. Se ei oleta NUL-päätettä. Tekstiprotokollissa, jossa data on NUL-päätteinen merkkijono, `std::string_view` on vaihtoehto — mutta binääri- ja osittaisdata-tapauksissa `span` on oikea työkalu.

## Ero muihin span-tunteihin

- `b06-cpp-span-heap-buffer`: yleinen `(ptr, len)` → `span` -modernisointi.
- `b08-cpp-span-bounds`: kun `span` on jo API:ssa, indeksoinnin turvallisuus (`at` vs `[]`).

Tässä kysymyksessä keskiössä on **rajattoman osoittimen korvaaminen**, ei indeksointitarkistus spanin sisällä.

[Lue lisää](https://en.cppreference.com/w/cpp/container/span)

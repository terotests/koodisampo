# Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistusta — tuotannossa buffer overflow. Mikä on moderni turvallinen tapa?

## Tilanne

API on jo modernisoitu: `void sumAt(std::span<int> data, size_t i)`. Kutsuja välittää indeksin ulkopuolelta — `data[i]` ei tee automaattista rajatarkistusta. `span::operator[]` on UB rajojen ulkopuolella, aivan kuten raaka taulukko.

Huom: `span` ratkaisee osoitin+pituus -ongelman; se **ei** korvaa indeksin validointia.

## Ratkaisu

C++20/C++23: tee eksplisiittinen tarkistus:

```cpp
int get(std::span<int> data, size_t i) {
    if (i >= data.size()) {
        throw std::out_of_range("index");
    }
    return data[i];
}
```

Hot pathissa, jossa indeksi on jo validoitu, `operator[]` on ok — mutta dokumentoi esiehto.

C++26:ssa `span::at()` tarjoaa rajatarkistetun pääsyn; C++20/C++23:ssa tarkista `i < data.size()` itse.

## Ero läheisiin teemoihin

- `b06-cpp-span-heap-buffer` / `b09-cpp-span-bounds-check`: korvaa `(ptr, len)` tai `char*` → `span`.
- Tämä oppitunti: `span` on jo käytössä — kysymys on **indeksoinnin** turvallisuudesta.

[Lue lisää](https://en.cppreference.com/w/cpp/container/span)

# Verkkoprotokolla serialisoi uint32_t:n. Mikä C++17+ tapa välttää manuaaliset shift-makrot?

## Tilanne

Legacy serialisointi:

```cpp
#define SWAP32(x) ((((x) & 0xff) << 24) | ...)
uint32_t wire = SWAP32(hostValue);
```

Makrot eivät tyyppitä, toistuvat joka projektissa, virhealttiita. Endian eri alustoilla — manuaaliset shiftit bugipintaa.

## Ratkaisu

**`std::endian`** (C++20) + **`std::byteswap`** (C++23):

```cpp
#include <bit>
uint32_t toWire(uint32_t host) {
    if constexpr (std::endian::native == std::endian::big)
        return host;
    return std::byteswap(host);
}
```

Ennen C++23: oma `byteswap` `std::endian`-tarkistuksella. Serialisoi kentät erikseen — älä `reinterpret_cast` koko structia.

## Käytännössä

Testaa round-trip x86 + ARM CI:ssä. CppBestPractices Portability. Protobuf/FlatBuffers vaihtoehto monimutkaiselle protokollalle.

[Lue lisää](https://en.cppreference.com/w/cpp/types/endian)

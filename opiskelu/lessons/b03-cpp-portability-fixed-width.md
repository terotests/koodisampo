# Verkkoprotokolla tallentaa `uint32_t` binäärimuodossa eri alustoille. Mitä tyyppiä käytät?

## Tilanne

Binääriprotokolla kirjoittaa headerin suoraan structiin:

```cpp
struct WireHeader {
    unsigned magic;
    unsigned length;
};

WireHeader h{0xDEADBEEF, payload.size()};
write(fd, &h, sizeof(h));
```

`unsigned` voi olla eri leveyttä eri alustoilla. Struct-padding voi lisätä yllättäviä aukkoja — sama lähdekoodi, eri byte layout ARM vs x86. Vastaanottaja lukee väärän `magic`:in tai payload-pituuden.

Protokollassa **bittileveys on osa sopimusta**, ei kääntäjän oletus.

## Ratkaisu

**`std::uint32_t`** (`<cstdint>`) jokaiselle kiinteän levyisyyden kentälle:

```cpp
#include <cstdint>

struct WireHeader {
    std::uint32_t magic;
    std::uint32_t length;
};

static_assert(sizeof(WireHeader) == 8);  // tarkista padding erikseen
```

Serialisoi kentät erikseen tai käytä `#pragma pack` vain tietoisesti dokumentoidulla protokollalla. Endian: muunna `std::byteswap` (C++23) tai vastaava ennen wireen kirjoitusta.

## Käytännössä

Älä `reinterpret_cast` koko structia verkkoon — padding-riski. Prefer eksplisiittinen write per kenttä. Testaa round-trip x86 + ARM CI:ssä. CppCoreGuidelines: fixed-width types wire formats.

[Lue lisää](https://en.cppreference.com/w/cpp/types/integer)

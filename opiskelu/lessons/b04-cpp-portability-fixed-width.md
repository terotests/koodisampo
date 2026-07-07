# Wire-protokolla käyttää `int` ja `long` — eri alustoilla eri koko. Portable korvaaja?

## Tilanne

Binääriprotokolla määrittelee kentät kuten "32-bittinen pituus" ja "64-bittinen tunniste". Koodi käyttää `int`, `long` tai `short` — ne ovat **implementaatiomääriteltyjä**: Windows 64-bitissä `long` on usein 32-bittinen, Linuxissa 64-bitissä 64-bittinen. Sama struct serialisoituu eri tavalla eri alustoilla.

Ongelma näkyy vasta integraatiossa: x86-palvelin ja ARM-asiakas, tai Windows ↔ Linux -rajapinta. Debuggaus on vaikeaa, koska yksittäiset yksikkötestit ajetaan yhdellä alustalla.

## Ratkaisu

Käytä `<cstdint>`-tyyppejä, joiden leveys on standardin mukaan kiinteä:

```cpp
#include <cstdint>

struct WireHeader {
    uint32_t magic;
    int32_t  payload_len;
    uint64_t request_id;
};
```

`int32_t`, `uint32_t`, `int64_t`, `uint64_t` tarkoittavat samaa kaikilla alustoilla. Ne sopivat wire-formaattiin; `int`/`long` sopivat vain paikalliseen laskentaan, kun koko ei ole protokollan osa.

## Käytännössä

- **Wire / tiedosto / verkko:** aina `stdint`-tyypit.
- **Sisäinen laskenta:** tavallinen `int`/`size_t` on usein ok, kun arvoa ei serialisoida sellaisenaan.
- **Älä oleta:** `sizeof(int) == 4` tai `sizeof(long) == 8` — tarkista protokolladokumentaatiossa ja testaa cross-compile.

Endian-kysymys on erillinen: kiinteä leveys ei takaa oikeaa tavujärjestystä. Verkkoprotokollassa tarvitaan usein eksplisiittinen big-endian tai `std::endian` (C++20) + `std::byteswap` (C++23) (ks. `b07-cpp-endian-portable`).

[Lue lisää](https://en.cppreference.com/w/cpp/types/integer)

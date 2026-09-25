# API ottaa raw pointer ja pituus — buffer overrun tuotannossa. Miten modernisoida turvallisesti?

## Tilanne

Rajapinta on muotoa `void process(const uint8_t* data, size_t len)`. Kutsuja välittää väärän pituuden tai `nullptr` + nolla — funktio lukee tai kirjoittaa yli bufferin. Pituus ja osoitin ovat erillisiä parametreja, joten refaktorointi tai copy-paste virhe jättää ne epäsynkassa.

Tämä on yleisin C-tyylinen buffer overflow -kuvio modernissa C++-koodissa.

## Ratkaisu

Yhdistä osoitin ja pituus yhdeksi tyypiksi — C++20:n `std::span`:

```cpp
void process(std::span<const std::byte> data) {
    for (std::byte b : data) { /* rajat data.size() */ }
}

// kutsu
process(std::as_bytes(std::span(buf, len)));  // buf: const uint8_t*
```

`span` ei omista dataa; se on näkymä olemassa olevaan taulukkoon, vektoriin tai puskuriin. Rajat kulkevat mukana API:ssa — kääntäjä ja koodinlukija näkevät ne yhdessä.

## Ero läheisiin teemoihin

- `b09-cpp-span-bounds-check`: painotus `char*`-API:n korvaamiseen binääri-/tekstidatassa.
- `b08-cpp-span-bounds`: kun `span` on jo käytössä, turvallinen indeksointi (tarkista `i < data.size()` ennen `operator[]`).

[Lue lisää](https://en.cppreference.com/w/cpp/container/span)

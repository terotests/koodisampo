# Bugi: `for (int i = 0; i < vec.size(); ++i)` — size_t vs int vertailu. Mikä on riski?

## Tilanne

Klassinen silmukka:

```cpp
std::vector<Item> vec = load();
for (int i = 0; i < vec.size(); ++i) {
    process(vec[i]);
}
```

`vec.size()` palauttaa `size_t` (unsigned). `i` on `int` (signed). Vertailu `i < vec.size()` muuntaa `i` unsignediksi. Jos `vec.size() > INT_MAX`, käyttäytyminen on outo. Yleisempi tapaus: jos `i` on negatiivinen jostain syystä, se näyttää suurelta unsigned-arvolta → silmukka voi **ohittaa kaiken** tai käyttäytyä väärin.

## Ratkaisu

```cpp
for (size_t i = 0; i < vec.size(); ++i) { ... }

// tai parempi — ei indeksiä lainkaan:
for (const auto& item : vec) { process(item); }
```

Jos tarvitset signed-indeksin, rajaa eksplisiittisesti: `for (int i = 0; i < static_cast<int>(vec.size()); ++i)` vain kun koko on taattu pieneksi.

## Käytännössä

`-Wsign-compare` löytää nämä. CppCoreGuidelines: älä sekoita signed/unsigned vertailuissa (Res-mix).

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-mix)

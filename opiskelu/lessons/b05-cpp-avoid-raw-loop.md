# Sprint review: sama for-silmukka toistuu viidessä tiedostossa. Mitä ehdotat refaktorointiin?

## Tilanne

Sprint review paljastaa identtisen mallin:

```cpp
for (size_t i = 0; i < items.size(); ++i) {
    process(items[i]);
}
```

Jokainen kopio sisältää omat riskinsä: signed/unsigned vertailu, off-by-one, tyhjä kontti. Viisi tiedostoa = viisi paikkaa korjata sama bugi. Intentio ("käy kaikki elementit") hukkuu indeksimechanismiin.

## Ratkaisu

**Range-for** tai **`std::for_each`**:

```cpp
for (const auto& item : items) {
    process(item);
}

// tai algoritmi + lambda:
std::for_each(items.begin(), items.end(), [](const auto& item) {
    process(item);
});
```

Range-for on idiomaattisin. `for_each` sopii, kun logiikka on lyhyt ja nimetty lambda parantaa luettavuutta.

## Käytännössä

Indeksi vain kun tarvitset position (`items[i+1]`). Muuten range-for. CppBestPractices Maintainability: vähennä toistoa — yksi idiomi, vähemmän review-pintaa. CppCoreGuidelines ES.71.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/05-Maintainability.md)

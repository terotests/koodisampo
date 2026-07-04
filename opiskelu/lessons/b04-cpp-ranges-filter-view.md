# Koodi luo väliaikaisen vectorin vain suodattaakseen ja laskeakseen count:in. C++20 ranges tapa?

## Tilanne

Suodatus + laskenta:

```cpp
std::vector<Item> active;
for (const auto& x : items) {
    if (x.isActive()) active.push_back(x);
}
size_t count = active.size();
```

Väliaikainen vector allokoi turhaan — tarvitaan vain count. Lukija lukee kaksi vaihetta (filter + size) sen sijaan että näkee intentin suoraan.

## Ratkaisu

**`std::ranges::count_if`** (C++20):

```cpp
size_t count = std::ranges::count_if(items, [](const Item& x) {
    return x.isActive();
});
```

Ei väliaikaista konttia — suoritus suoraan lähtökokoelmasta. Lazy views (`filter | common`) kun tarvitset ketjun ilman materialisointia.

## Käytännössä

Prefer algoritmit/ranges intentin ilmaisuun. `count_if`, `find_if`, `any_of` — std on testattu. C++20 ranges vähentää väliaikaisia vectoreita. CppCoreGuidelines: use algorithms.

[Lue lisää](https://en.cppreference.com/w/cpp/ranges/count_if)

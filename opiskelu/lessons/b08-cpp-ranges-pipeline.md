# Suodatat ja muunnat vectorin — väliaikaisia vector-kopioita tulee liikaa. C++20 tapa?

## Tilanne

```cpp
std::vector<int> tmp;
for (const auto& x : src) {
    if (pred(x)) tmp.push_back(transform(x));
}
size_t n = tmp.size();
```

Materialisoi koko välikontti vain count:ia varten.

## Ratkaisu

**`std::ranges::count_if`** tai lazy views:

```cpp
size_t n = std::ranges::count_if(src, pred);
```

Transform + filter pipeline ilman välivedosta kun mahdollista.

## Käytännössä

C++23: `ranges::to` materialisoi tarvittaessa:

```cpp
// C++23
auto out = values | std::ranges::to<std::vector>();
```

C++20: materialisoi silmukalla tai `std::vector`-konstruktorilla. Profiloi — lazy ei aina nopein. CppCoreGuidelines: algorithms over hand loops.

[Lue lisää](https://en.cppreference.com/w/cpp/ranges/count_if)

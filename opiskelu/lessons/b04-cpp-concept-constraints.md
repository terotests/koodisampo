# Generinen funktio `template<typename T> void sort(T& c)` kaatuu outoihin virheviesteihin kun T on custom-tyyppi. Miten rajaat template-parametrin luettavaksi?

## Tilanne

```cpp
template<typename T>
void sortLike(T& c) {
    std::sort(c.begin(), c.end());  // virhe 50 riviä syvällä
}
```

Custom tyyppi ilman iteratoria — kääntäjäviesti mainitsee sisäisen instanssoinnin, ei kutsukohdan virhettä.

## Ratkaisu

**C++20 concepts**:

```cpp
template<std::ranges::sortable R>
void sortLike(R& c) {
    std::ranges::sort(c);
}
```

Tai `requires std::sortable<R>`. Virheellinen tyyppi → "constraints not satisfied" kutsukohdassa.

## Käytännössä

Std-konseptit: `sortable`, `copyable`, `regular`. Omat konseptit domain-rajapintoihin. CppCoreGuidelines T.24.

[Lue lisää](https://en.cppreference.com/w/cpp/language/constraints)

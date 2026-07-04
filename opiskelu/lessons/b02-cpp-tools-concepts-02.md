# Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan?

## Tilanne

Generinen apufunktio kääntyy monelle tyypille — myös sellaisille, joille `swap` tai vertailu ei ole mielekästä. Virheilmoitus mainitsee sisäisen template-instantiaation 50 riviä syveltä: `no match for 'operator<'`. Kehittäjä käyttää tuntia selvittääkseen, mikä parametri oli väärä.

Ilman rajoitteita template-metaprogrammointi siirtää virheet myöhäiseen vaiheeseen ja tekee niistä vaikeasti luettavia.

## Ratkaisu

C++20 **concepts** rajaavat template-parametrin käännösaikana:

```cpp
#include <concepts>

template<std::totally_ordered T>
void sortLike(T& a, T& b) {
    if (b < a) std::swap(a, b);
}

template<std::ranges::range R>
  requires std::sortable<R>
void sortContainer(R& range) {
    std::ranges::sort(range);
}
```

Kun kutsu on virheellinen, kääntäjä raportoi: "constraints not satisfied" — suoraan kutsukohdassa, ei syvällä instanssissa.

## Käytännössä

Aloita std-konsepteista (`std::sortable`, `std::copyable`, `std::regular`). Omiin tyyppeihin: määrittele `concept Hashable` ja käytä `template<Hashable T>`. Concepts korvaavat monimutkaiset SFINAE-traikit luettavammalla syntaksilla.

[Lue lisää](https://en.cppreference.com/w/cpp/language/constraints)

# Tehdasfunktio luo dynaamisen olion. Miksi `std::make_unique<T>()` on parempi kuin `new T()`?

## Tilanne

Tehdas palauttaa raa'an osoittimen:

```cpp
Widget* createWidget(const Config& cfg) {
    auto* w = new Widget(cfg);
    validate(w);  // voi heittää
    return w;     // leak jos validate heittää
}
```

Jos `validate` tai jokin välivaihe heittää poikkeuksen ennen `return`:ia, `new`:lla luotu olio vuotaa. `new` + osoitin erottaa allokaation omistuksesta — exception-safety riippuu manuaalisesta `delete`:stä jokaisella polulla.

## Ratkaisu

**`std::make_unique<Widget>(cfg)`**:

```cpp
std::unique_ptr<Widget> createWidget(const Config& cfg) {
    auto w = std::make_unique<Widget>(cfg);
    validate(w.get());
    return w;
}
```

Poikkeus missä tahansa → `unique_ptr` destruktori vapauttaa. Ei erillistä `new`/`delete`-paria. Omistus siirtyy selkeästi palautuksella.

## Käytännössä

CppCoreGuidelines R.11: vältä naked `new`. `make_unique` yhdellä allokaatiolla; `make_shared` jaetulle omistukselle. Custom deleter: `unique_ptr<T, Deleter>` — harvoin tarvitaan `new` suoraan.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-make_unique)

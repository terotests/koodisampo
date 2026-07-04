# 200-rivinen funktio vaikeuttaa unit testausta. Mitä refaktorointia ehdotat ensin?

## Tilanne

God function:

```cpp
void processOrder(Order& o) {
    // 50 riviä validointia
    // 50 riviä hinnoittelua
    // 50 riviä varastotarkistusta
    // 50 riviä lokitus + persist
}
```

Yhtä funktiota ei voi testata erikseen — unit testit vaativat koko putken mockattuna. Bugi hinnoittelussa vaatii debuggausta 200 rivin läpi. Code review on käytännössä mahdoton.

## Ratkaisu

**Extract function** — pienemmät nimetty funktiot:

```cpp
ValidationResult validate(const Order& o);
Price quote(const Order& o, const Catalog& cat);
bool reserveStock(Order& o, Inventory& inv);

void processOrder(Order& o) {
    auto v = validate(o);
    if (!v.ok) throw ValidationError(v.msg);
    o.price = quote(o, catalog_);
    if (!reserveStock(o, inventory_)) throw OutOfStock{};
    persist(o);
}
```

Jokainen funktio testattavissa erikseen. Intentio näkyy orchestrator-funktiossa.

## Käytännössä

CppBestPractices Maintainability: yksi tehtävä per funktio. Aloita extract ilman arkkitehtuurimuutosta — pienin askel testattavuuteen. Template method / strategy myöhemmin jos tarvitaan.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/05-Maintainability.md)

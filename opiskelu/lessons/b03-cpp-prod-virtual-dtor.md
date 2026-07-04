# Tuotantobugi: `delete base_ptr` ei kutsu johdetun luokan destructoria. Mikä korjaus?

## Tilanne

Polymorfinen hierarkia:

```cpp
struct Base { ~Base() { cleanupBase(); } };
struct Derived : Base {
    ~Derived() { cleanupDerived(); }
    std::unique_ptr<Resource> res_;
};

Base* ptr = new Derived();
delete ptr;  // kutsuu vain ~Base — res_ ei tuhoa, Derived cleanup puuttuu
```

Ilman **virtual destruktoria** `delete` base-osoittimella kutsuu vain base-luokan destructoria. Johdetun luokan jäsenet ja resurssit jäävät — memory leak, avoimet handle:t, UB.

## Ratkaisu

**`virtual ~Base() = default;`** polymorfiselle pohjalle:

```cpp
struct Base {
    virtual ~Base() = default;
};
```

Nyt `delete ptr` kutsuu `~Derived()` → `~Base()` oikeassa järjestyksessä. Prefer smart pointerit: `std::unique_ptr<Base>` kutsuu virtual destruktorin automaattisesti.

## Käytännössä

Sääntö: jos luokalla on virtual-metodeja ja sitä poistetaan base-osoittimella → virtual destructor. CppCoreGuidelines C.35, C.67. `= default` riittää jos jäsenet hoitavat cleanupin.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#c-dtor)

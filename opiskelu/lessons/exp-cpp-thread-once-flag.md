# Singleton alustetaan lazy-initillä useasta säikeestä. Mikä standardikomponentti takaa kertaluonteisen alustuksen?

## Tilanne

Lazy singleton:

```cpp
Database& instance() {
    static Database db;  // C++11: thread-safe static init
    return db;
}
```

Monimutkaisempi tapaus — eksplisiittinen init funktio:

```cpp
void initOnce() {
    if (!initialized) {
        heavySetup();  // kaksi säiettä voi tulla tänne
        initialized = true;
    }
}
```

Ilman synkronointia kaksi säiettä alustaa kahdesti — tuplakytkennät, file descriptor -vuodot, corrupt tila.

## Ratkaisu

**`std::call_once` + `std::once_flag`**:

```cpp
std::once_flag flag;

void initOnce() {
    std::call_once(flag, [] {
        heavySetup();
    });
}
```

Vain yksi säie suorittaa funktion; muut odottavat valmistumista. Static local (`static Database db`) on usein riittävä — C++11 takaa thread-safe initin ("magic statics").

## Käytännössä

Prefer static local singleton yksinkertaisissa tapauksissa. `call_once` monivaiheiseen initiin. Vältä double-checked locking käsin — virhealtista. CppCoreGuidelines CP.44.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/call_once)

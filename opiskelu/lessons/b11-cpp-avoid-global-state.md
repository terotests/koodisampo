# Moduulissa on `static std::map<int, User> g_cache` ja useat säikeet kutsuvat sitä. Ensimmäinen refaktorointi?

## Tilanne

```cpp
static std::map<int, User> g_cache;

User getUser(int id) {
    return g_cache[id];  // data race ilman mutexia
}
```

Globaali mutable tila — testaus vaikeaa, data race, piilotettu riippuvuus.

## Ratkaisu

1. **Injektoi riippuvuus** — cache olion tai servicen jäsenenä
2. Tai **suojaa mutexilla** jos globaali välttämätön

```cpp
class UserService {
    std::mutex mtx_;
    std::map<int, User> cache_;
public:
    User getUser(int id);
};
```

Vähennä globaalia tilaa — selkeä elinikä ja testattavuus.

## Käytännössä

CppCoreGuidelines I.2: avoid global state. Singleton vain perustellusti. TSan löytää racet.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/07-Considering_Threadability.md)

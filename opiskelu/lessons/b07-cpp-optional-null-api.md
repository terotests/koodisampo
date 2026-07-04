# Hakufunktio palauttaa -1 kun avainta ei löydy — kutsujat sekoittavat virheen ja validin arvon. Parempi API?

## Tilanne

Lookup API:

```cpp
int findUserId(const std::string& name) {
    auto it = users.find(name);
    if (it == users.end()) return -1;
    return it->second;
}

int id = findUserId("admin");
if (id) { /* BUG — id 0 on validi mutta falsy */ }
```

Magic sentinel (`-1`, `nullptr`, `0`) sekoittuu validiin arvoon. Kutsuja voi tulkita virheen väärin tai unohtaa tarkistuksen. Erillinen `bool found` + out-parametri on parempi mutta kömpelö.

## Ratkaisu

**`std::optional<int>`** (tai `optional<User>`):

```cpp
std::optional<int> findUserId(const std::string& name) {
    auto it = users.find(name);
    if (it == users.end()) return std::nullopt;
    return it->second;
}

if (auto id = findUserId("admin")) {
    use(*id);
}
```

Tyhjä optional = ei löytynyt — erillinen validista arvosta. Ei magic number -sentineliä.

## Käytännössä

C++23: `std::expected` virhekoodeille. `optional` kun "ei arvoa" on ainoa virhe. CppCoreGuidelines: avoid sentinel values in APIs.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/optional)

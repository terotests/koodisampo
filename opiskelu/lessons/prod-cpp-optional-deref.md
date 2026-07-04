# Koodi tekee `return *findUser(id);` missä `findUser` palauttaa `std::optional<User>`. Mikä ongelma?

## Tilanne

Tuotantokoodi:

```cpp
User getUser(int id) {
    return *findUser(id);  // findUser → optional<User>
}
```

Jos käyttäjää ei löydy, `optional` on tyhjä — **dereferointi on undefined behavior**. Ei kaatumista aina — satunnainen muisti, turvallisuusaukko. Null-tarkistus puuttuu, koska `*` näyttää "normaalilta" pointer-syntaksilta.

## Ratkaisu

Tarkista ennen dereferointia:

```cpp
std::optional<User> getUser(int id) {
    return findUser(id);  // propagoi optional
}

// kutsuja:
if (auto user = getUser(id)) {
    use(*user);
} else {
    handleNotFound();
}
```

Tai heitä poikkeus: `if (!u) throw NotFound{}; return *u;`

## Käytännössä

Älä koskaan `*optional` ilman tarkistusta. `value()` heittää `bad_optional_access`. C++23 `expected` virhekoodeille. Code review: "optional → tarkista ennen *."

[Lue lisää](https://en.cppreference.com/w/cpp/utility/optional/operator*)

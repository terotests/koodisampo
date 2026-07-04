# Code review: switch-case käyttää `enum Status { OK, FAIL }` ilman scopea. Miksi reviewer pyytää muutosta?

## Tilanne

Code reviewissa näkyy:

```cpp
enum Status { OK, FAIL, RETRY };

Status parse(const std::string& s) {
    if (s == "ok") return OK;
    // ...
}

void log(int code);  // toinen moduuli
log(OK);             // implisiittinen int — Status vs int sekoittuu
```

Unscoped `enum` vuotaa `OK`, `FAIL` globaaliin namespaceen — törmää toisen headerin `OK`:hon. Arvot muuntuvat implisiittisesti `int`:iksi, joten switch ja overloadit eivät suojaa tyyppivirheiltä. Uusi arvo `TIMEOUT` lisätään enumiin, mutta switch-case unohtuu — kääntäjä ei aina varoita.

## Ratkaisu

Refaktoroi **`enum class`**:

```cpp
enum class Status { OK, FAIL, RETRY };

Status parse(const std::string& s) {
    if (s == "ok") return Status::OK;
    return Status::FAIL;
}

switch (auto st = parse(s); st) {
    case Status::OK: break;
    case Status::FAIL: break;
    case Status::RETRY: break;
}
```

Scoped enum estää implisiittiset int-muunnokset ja nimikonfliktit. `-Wswitch` auttaa puuttuvien case:jen löytämisessä.

## Käytännössä

Review-kommentti: "Käytä enum class — cpp-best-practices Style." Legacy-koodi: refaktoroi moduuli kerrallaan. Jos tarvitset C-API:n int-koodin, rajaa `static_cast<int>(Status::OK)` yhteen rajapintafunktioon.

[Lue lisää](https://en.cppreference.com/w/cpp/language/enum)

# Miksi `enum class` on parempi kuin vanha C-tyylinen `enum`?

## Tilanne

Header-tiedostossa määritellään tila:

```cpp
enum Status { OK, FAIL, PENDING };

enum Color { Red, Green };  // toisessa headerissa

void handle(int code);
handle(OK);  // implisiittinen int-muunnos
```

Vanha `enum` vuotaa enumerattorit **globaaliin namespaceen** — `OK` voi törmätä toisen headerin `OK`:hon. Lisäksi enum arvot muuntuvat implisiittisesti `int`:iksi, joten `handle(OK)` ja `handle(42)` ovat samanlaisia kääntäjän silmissä. Switch-case ilman `default`:ia voi jättää uuden arvon käsittelemättä huomaamatta.

## Ratkaisu

**`enum class`** (scoped enum, C++11) eristää arvot tyyppiin:

```cpp
enum class Status { OK, FAIL, PENDING };
enum class Color { Red, Green };

Status s = Status::OK;
// handle(s);  // EI käännä ilman static_cast<int>

switch (s) {
    case Status::OK: break;
    case Status::FAIL: break;
    // case Status::PENDING: — kääntäjä varoittaa puuttuvasta case:sta -Wswitch
}
```

`enum class` ei vuoda nimiä, ei implisiittistä int-muunnosta, ja taustatyyppi voidaan valita (`enum class Status : uint8_t`).

## Käytännössä

CppBestPractices Style suosittelee `enum class`:ia uudessa koodissa. Legacy C-enumit refaktoroidaan vaiheittain. Jos tarvitset C-API-yhteensopivuutta, dokumentoi rajattu `static_cast` — älä palaa unscoped enumiin koko codebaseen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/enum)

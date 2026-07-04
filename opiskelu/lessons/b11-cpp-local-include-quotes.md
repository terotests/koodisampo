# Projektin oma header includataan `#include <MyWidget.hpp>`. Mitä cpp-best-practices suosittelee?

## Tilanne

```cpp
#include <MyWidget.hpp>   // projektin oma — väärä syntaksi?
#include <vector>         // std — oikein <>
```

Kulmasulkeet `<>` etsivät **system include path** -hakemistoista. Projektin omat headerit eivät ole siellä — kääntäjä voi löytää väärän tiedoston tai epäonnistua riippuen `-I`-järjestyksestä.

## Ratkaisu

**Lainausmerkit `"..."`** projektin omiin headereihin:

```cpp
#include "MyWidget.hpp"
#include <vector>
```

`""` etsii ensin nykyisestä hakemistosta, sitten include pathista. `<>` vain system/SDK-kirjastoille.

## Käytännössä

CppBestPractices: `"` local, `<>` system. IWYU auttaa siivoamaan turhat includet. Review: "Korjaa include-syntaksi."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)

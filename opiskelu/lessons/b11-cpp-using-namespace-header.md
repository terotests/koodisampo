# Uusi header alkaa `using namespace std;` ja includataan kymmenessä moduulissa. Miksi vaarallista?

## Tilanne

```cpp
// utils.hpp
using namespace std;

// myapp.cpp
#include "utils.hpp"
#include <vector>  // std::vector vs vector — riippuu järjestyksestä
```

Headerin `using namespace std` **vuotaa** kaikkiin includereihin. `count`, `distance`, `merge` — nimiristiriidat oman koodin kanssa. ADL ja overload-resoluutio muuttuvat yllättäen. Kolmannen osapuolen header + `using namespace std` = vaikea debugata.

## Ratkaisu

**Älä koskaan** `using namespace std` (tai muuta namespacea) **header-tiedostossa**.

```cpp
// ok .cpp-tiedostossa rajatusti:
void foo() {
    using std::string;
    string s;
}
```

Header: aina täysin qualifioitu `std::vector` tai rajattu `using std::string;` vain funktion sisällä.

## Käytännössä

CppCoreGuidelines SF.7: "Don't write `using namespace` in a header." Review: hylkää header, jossa on globaali using. Poikkeus: harvinaiset internal detail -headerit, jotka eivät includata ulos.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)

# Koodi käyttää `GetFileAttributesW` / `stat()` suoraan polkujen käsittelyyn. Portable vaihtoehto?

## Tilanne

Platform-kohtainen koodi:

```cpp
#ifdef _WIN32
    DWORD attr = GetFileAttributesW(path.c_str());
#else
    struct stat st;
    stat(path.c_str(), &st);
#endif
```

Jokainen polku-operaatio vaatii `#ifdef`-haarat. Virheet copy-paste:ssa — Windows-polku vs POSIX. Uusi alusta = uusi haara.

## Ratkaisu

**`std::filesystem`** (C++17):

```cpp
#include <filesystem>
namespace fs = std::filesystem;

if (fs::exists(path)) { /* ... */ }
auto size = fs::file_size(path);
fs::copy(src, dst);
```

Sama API Windows, Linux, macOS — implementaatio kirjastossa. `path` käsittelee erottimia.

## Käytännössä

Prefer `filesystem` uudessa koodissa. Legacy: kääri yhteen `platform::exists()`. Linkitä `-lstdc++fs` (vanhempi GCC). CppCoreGuidelines: use standard library abstractions.

[Lue lisää](https://en.cppreference.com/w/cpp/filesystem)

# Jaetaan kirjasto Windowsin ja Linuxin välillä. Mikä rajapintavalinta parantaa ABI-vakautta?

## Tilanne

DLL export:

```cpp
class Widget { std::string name_; };  // STL ABI eri MSVC vs libstdc++
__declspec(dllexport) Widget* create();
```

STL-tyypit rajapinnassa — **ABI rikkoutuu** eri kääntäjillä/versioilla.

## Ratkaisu

**C-tyylinen ulko-API** + export-makrot:

```cpp
extern "C" {
#ifdef _WIN32
  __declspec(dllexport)
#endif
  void* widget_create(const char* name);
}
```

Implementaatio C++:lla sisällä — julkinen API stable C. PIMPL piilottaa STL:n.

## Käytännössä

CppBestPractices Portability. Älä `std::string`/`vector` DLL-rajapinnassa. Versionoi C API.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/05-Portability.md)

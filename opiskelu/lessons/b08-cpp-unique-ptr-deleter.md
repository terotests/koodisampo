# FILE* pitää sulkea fclose:lla — unique_ptr<void> ei riitä. Miten mallinnet?

## Tilanne

```cpp
std::unique_ptr<void, ???> f(fopen(...));  // mikä deleter?
```

`unique_ptr<void>` ei kutsu `fclose` — väärä deleter tyyppi. Raaka `fclose` manuaalisesti → poikkeuspolku vuotaa.

## Ratkaisu

**Custom deleter**:

```cpp
using FilePtr = std::unique_ptr<FILE, decltype(&fclose)>;
FilePtr f(fopen("log.txt", "a"), &fclose);
```

Lambda-deleter: `unique_ptr<FILE, int(*)(FILE*)>` tai wrapper-struct.

## Käytännössä

Prefer `std::fstream`. C-API: unique_ptr + deleter. CppCoreGuidelines R.9.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/unique_ptr)

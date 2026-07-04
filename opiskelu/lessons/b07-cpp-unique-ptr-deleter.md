# RAII-wrapper hallitsee C-API:n FILE*-pointteria. Miksi std::unique_ptr custom deleter on parempi kuin raw delete?

## Tilanne

C-API wrapper:

```cpp
FILE* f = fopen("log.txt", "a");
if (!f) return;
// ...
if (error) return;  // fclose unohtuu
fclose(f);
```

`FILE*` ei käytä `delete` — `fclose`. Raaka osoitin + manuaalinen cleanup on sama ongelma kuin `new`/`delete`: poikkeuspolku vuotaa handle:n.

## Ratkaisu

**`unique_ptr` custom deleter**:

```cpp
using FilePtr = std::unique_ptr<FILE, decltype(&fclose)>;

FilePtr openLog(const char* path) {
    return FilePtr(fopen(path, "a"), &fclose);
}

void writeLog(const char* path, std::string_view msg) {
    auto f = openLog(path);
    if (!f) throw std::runtime_error("open failed");
    std::fwrite(msg.data(), 1, msg.size(), f.get());
}  // fclose automaattisesti
```

Destruktori kutsuu `fclose` — myös poikkeuksessa. RAII sama periaate kuin `unique_ptr<T>` default deleterillä.

## Käytännössä

Prefer `std::fstream` uudessa koodissa. C-API:lle: `unique_ptr` + deleter lambda tai function pointer. CppCoreGuidelines R.1, R.9.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/unique_ptr)

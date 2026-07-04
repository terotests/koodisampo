# Code review: `shared_ptr<Foo>(new Foo(), customDeleter)`. Milloin make_shared EI ole oikea vaihtoehto?

## Tilanne

Resurssi tarvitsee custom deleterin:

```cpp
auto ptr = std::shared_ptr<FILE>(
    fopen("log.txt", "w"),
    [](FILE* f) { if (f) fclose(f); }
);
```

Kehittäjä kysyy: miksi ei `make_shared`? Yritetään:

```cpp
// EI toimi — make_shared ei ota custom deleteriä
auto ptr = std::make_shared<FILE>(...);
```

`make_shared` optimoi yhden allokaation (olio + control block), mutta se luo olion oletusdeleterillä — ei custom cleanup-logiikkaa.

## Ratkaisu

**Custom deleter → `shared_ptr` konstruktori suoraan**:

```cpp
using FilePtr = std::shared_ptr<FILE>;
FilePtr openLog(const char* path) {
    return FilePtr(fopen(path, "w"), [](FILE* f) {
        if (f) fclose(f);
    });
}
```

`make_shared` kun **ei** custom deleteriä — halvempi ja cache-ystävällisempi. Custom deleter kun resurssi on C-API (`FILE*`, socket, `malloc`).

## Käytännössä

Prefer `make_shared<Foo>()` normaalisti. Custom deleter: suora konstruktori. Vaihtoehto: RAII-wrapper-luokka + `make_shared<Wrapper>`. CppCoreGuidelines R.14.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared)

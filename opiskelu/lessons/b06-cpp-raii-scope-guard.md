# Funktio avaa tiedoston ja pitää sulkea poikkeuksessa. Miten toteutat ilman goto cleanup?

## Tilanne

```cpp
bool process(const char* path) {
    FILE* f = fopen(path, "r");
    if (!f) return false;
    if (!step1(f)) { fclose(f); return false; }
    if (!step2(f)) { fclose(f); return false; }
    fclose(f);
    return true;
}
```

Jokainen polku tarvitsee `fclose` — helppo unohtaa. Poikkeus ohittaa kaiken.

## Ratkaisu

**RAII** — `std::ifstream` tai scope guard:

```cpp
bool process(const std::string& path) {
    std::ifstream f(path);
    if (!f) return false;
    if (!step1(f)) return false;
    if (!step2(f)) return false;
    return true;
}  // sulkeutuu automaattisesti
```

Custom guard: `scope_exit` (GSL) tai `unique_ptr` deleterillä.

## Käytännössä

CppCoreGuidelines R.1: RAII every resource. Review: "Ei raakaa fopen ilman RAII."

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Re-raii)

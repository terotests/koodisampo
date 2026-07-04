# Aliluokan virtuaalinen metodi ei koskaan kutsuta — kirjoitusvirhe parametrilistassa. Miten estät?

## Tilanne

```cpp
struct Base { virtual void run(int x); };
struct Derived : Base {
    void run(int y) override;  // OK jos signatuuri sama
    void run(double x);        // overload — EI override
};
```

Pieni signatuurimuutos → piilotettu bugi. Ilman `override` kääntäjä ei varoita overloadista.

## Ratkaisu

**`override`** pakolliseksi käytännöksi:

```cpp
void run(int y) override;
```

Väärä signatuuri → compile error. Yhdistä `-Wsuggest-override`.

## Käytännössä

Review checklist: override kaikissa virtual-ylikirjoituksissa. CppCoreGuidelines C.128.

[Lue lisää](https://en.cppreference.com/w/cpp/language/override)

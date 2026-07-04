# Koodi: `assert(registerCallback(handler));` — release-buildissa callback ei rekisteröidy. Miksi?

## Tilanne

```cpp
assert(registerCallback(handler));
```

**`NDEBUG`** release-buildissa poistaa `assert`:in kokonaan — **sivuvaikutus katoaa**. Callback ei rekisteröidy tuotannossa, debug toimii.

## Ratkaisu

Älä side-effect assertissa:

```cpp
if (!registerCallback(handler)) {
    throw std::runtime_error("register failed");
}
```

Assert vain **pure checks**: `assert(ptr != nullptr);`

## Käytännössä

CppCoreGuidelines: assert ei korvaa virheenkäsittelyä tuotannossa. `-DNDEBUG` release. Review: "Ei sivuvaikutuksia assertissa."

[Lue lisää](https://en.cppreference.com/w/cpp/error/assert)

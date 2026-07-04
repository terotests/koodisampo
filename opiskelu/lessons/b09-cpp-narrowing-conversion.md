# Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana?

**Ratkaisu:** C++20 `std::in_range<int32_t>(value)` tai `gsl::narrow` / oma `static_assert` + tarkistus.

```cpp
int64_t big = ...;
if (!std::in_range<int32_t>(big)) throw std::overflow_error("...");
int32_t safe = static_cast<int32_t>(big);
```

GCC/Clang: `-Wconversion` / `-Wnarrowing`.

# Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa?

**Ratkaisu:** `std::endian` + `std::byteswap` — muunna verkko-/little endian eksplisiittisesti:

```cpp
uint32_t raw = read_u32(socket);
uint32_t host = std::byteswap(raw);  // jos wire on big-endian
```

Älä lue suoraan structiin eri endian-alustalla ilman normalisointia.

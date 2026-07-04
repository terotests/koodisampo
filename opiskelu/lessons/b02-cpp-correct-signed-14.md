# Bugiraportti: `if (index >= 0)` on aina tosi kun `index` on `size_t`. Miksi tarkistus on hyödytön?

## Tilanne

Koodi yrittää varmistaa, että indeksi on validi:

```cpp
size_t index = computeIndex();
if (index >= 0) {
    use(data[index]);
}
```

Code review huomaa: tarkistus ei koskaan epäonnistu. Bugi jää piiloon — kehittäjä luulee puolustautuneensa negatiivisia indeksejä vastaan.

## Ratkaisu

`size_t` on **unsigned** — arvo on aina ≥ 0. Vertailu nollaan on tautologia. Oikea tarkistus on yläraja:

```cpp
if (index < data.size()) {
    use(data[index]);
}
```

Tai käytä `data.at(index)` poikkeuksen kanssa. Jos tarvitset signed-indeksin (esim. "ei löytynyt" = -1), käytä `ptrdiff_t` tai `std::optional<size_t>` — älä sekoita `int` ja `size_t` vertailuissa.

## Käytännössä

`-Wsign-compare` ja `-Wconversion` auttavat löytämään sekoitukset. CppCoreGuidelines ES.100: älä sekoita signed ja unsigned vertailuissa.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-mix)

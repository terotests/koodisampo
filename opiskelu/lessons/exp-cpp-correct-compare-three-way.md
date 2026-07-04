# Sorttaus comparator palauttaa `<` ja `>` mutta unohtaa yhtäsuuruuden — epävakaa sort. C++20 ratkaisu?

**Ratkaisu:** kolmisuuntainen vertailu `operator<=>` (spaceship):

```cpp
auto operator<=>(const Item&) const = default;
```

Tai eksplisiittinen `std::strong_ordering`. `std::sort` vaatii tiukan heikomman järjestyksen — pelkkä `<`/`>` ilman `==`-haaraa voi rikkoa invariantin.

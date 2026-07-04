# Sprintin lopussa löytyy käsin kirjoitettu for-silmukka joka etsii max-arvon vektorista. Mitä ehdotat?

## Tilanne

Sprintin lopussa code review paljastaa saman mallin viidessä tiedostossa:

```cpp
int maxVal = vec[0];
for (size_t i = 1; i < vec.size(); ++i) {
    if (vec[i] > maxVal) maxVal = vec[i];
}
```

Jokainen kopio sisältää omat riskinsä: tyhjä vektori → `vec[0]` on UB, off-by-one indeksissä, väärä vertailu (`>` vs `>=`), signed/unsigned vertailu. Testit kattavat yhden polun — toinen tiedosto jää eri bugilla.

## Ratkaisu

Käytä standardikirjaston **`std::max_element`**:

```cpp
if (vec.empty()) { /* käsittele */ }

auto it = std::max_element(vec.begin(), vec.end());
int maxVal = *it;
```

Algoritmi on testattu, ilmaisee intentin ("suurin elementti") ja vähentää toistuvaa bugipintaa. C++20: `std::ranges::max_element(vec)`.

Samoin `min_element`, `find`, `sort` — älä kirjoita uudelleen, jos std tarjoaa saman.

## Käytännössä

Maintainability-parannus: yksi rivi reviewattavaksi vs kymmenen. Custom comparator: `max_element(begin, end, [](auto& a, auto& b){ return a.score < b.score; })`. Muista tyhjä kontti ennen dereferointia — `max_element` palauttaa `end()` tyhjälle.

[Lue lisää](https://en.cppreference.com/w/cpp/algorithm/max_element)

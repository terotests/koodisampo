# Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistusta — tuotannossa buffer overflow. Mikä on moderni turvallinen tapa?

**Ratkaisu:** `span.at(i)` — heittää `std::out_of_range`. Tai tarkista `i < span.size()` ennen `[i]`:tä.

```cpp
int v = data.at(i);  // ei UB, vaan poikkeus
```

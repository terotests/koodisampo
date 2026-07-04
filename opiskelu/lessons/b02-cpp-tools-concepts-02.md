# Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan?

**Ratkaisu:** C++20 `concept`:

```cpp
template<std::totally_ordered T>
void sortLike(T& a, T& b) {
    if (b < a) std::swap(a, b);
}
```

Virheellinen tyyppi → selkeä kääntäjäviesti heti rajapinnassa.

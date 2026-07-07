# Funktio `void f(std::array<int, 3>)` — kutsu `f({1,2,3})` käännyy, mutta `auto x = {1,2,3}; f(x);` ei. Miksi?

## Tilanne

```cpp
void f(std::array<int, 3> a);

f({1, 2, 3});           // OK — array init
auto x = {1, 2, 3};     // std::initializer_list<int>
f(x);                   // EI käännä
```

**`auto x = {1,2,3}`** deduktoidaan **`std::initializer_list<int>`**:ksi copy-list-initializationissa — ei `array`:ksi. `auto x{1}` on eri tapaus.

## Ratkaisu

Ole eksplisiittinen:

```cpp
std::array<int, 3> x{1, 2, 3};
f(x);

// tai suoraan:
f(std::array<int, 3>{1, 2, 3});
```

Muista: `auto v = {1,2,3}` ≠ vector eikä array.

## Käytännössä

CppCoreGuidelines ES.11. Review: "auto + brace → initializer_list trap."

[Lue lisää](https://en.cppreference.com/w/cpp/utility/initializer_list)

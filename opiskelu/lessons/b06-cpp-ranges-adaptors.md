# Silmukka filtteröi ja muuntaa konttia — lukija ei näe intentiota. Miten C++20 ranges auttaa?

## Tilanne

```cpp
std::vector<int> result;
for (const auto& x : items) {
    if (x.active) result.push_back(x.score * 2);
}
```

Kaksi vaihetta piilossa — filter + transform. Väliaikainen vector.

## Ratkaisu

**Ranges pipeline**:

```cpp
#include <ranges>
namespace rv = std::ranges::views;

auto values = items
    | rv::filter([](const auto& x) { return x.active; })
    | rv::transform([](const auto& x) { return x.score * 2; });
```

Tai `std::ranges::count_if` jos vain laskenta. Lazy views — ei välikopiota ennen materialisointia.

## Käytännössä

`ranges::to<std::vector>` (C++23) materialisoi. CppCoreGuidelines: express intent with algorithms.

[Lue lisää](https://en.cppreference.com/w/cpp/ranges/filter_view)

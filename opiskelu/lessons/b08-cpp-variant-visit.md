# std::variant<int, string> — switch-tyylinen käsittely ilman visitor-luokkaa. Moderni tapa?

## Tilanne

```cpp
std::variant<int, std::string> v;
if (std::holds_alternative<int>(v)) { /* ... */ }
else if (std::holds_alternative<std::string>(v)) { /* ... */ }
```

Manuaalinen ketju — uusi alternative → helppo unohtaa haara.

## Ratkaisu

**`std::visit`** + overloaded lambdas:

```cpp
std::visit([](auto&& arg) {
    using T = std::decay_t<decltype(arg)>;
    if constexpr (std::is_same_v<T, int>) { /* ... */ }
    else { /* string */ }
}, v);
```

C++20: `visit([](auto& x){ ... }, v)` — yksi käsittelijä per tyyppi.

## Käytännössä

Exhaustive visit + static_assert uusille tyypeille. CppCoreGuidelines: prefer visit.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/variant/visit)

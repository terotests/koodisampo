# Tehdasfunktio make<T>(Args&&... args) välittää argumentit konstruktorille. Mikä idiomi säilyttää value categoryn?

## Tilanne

```cpp
template<typename T, typename... Args>
T make(Args... args) {  // kopioi — move menetetty
    return T(args...);
}
```

Perfect forwarding vaatii universal reference + forward.

## Ratkaisu

```cpp
template<typename T, typename... Args>
T make(Args&&... args) {
    return T(std::forward<Args>(args)...);
}
```

`T&&` + `std::forward` säilyttää lvalue/rvalue — `make_unique` käyttää samaa.

## Käytännössä

Älä forward samaa argumenttia kahdesti. CppCoreGuidelines F.19. `std::make_unique`, `emplace` rakentavat tätä.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/forward)

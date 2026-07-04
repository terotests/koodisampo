# Funktio hakee arvon mapista ja tarkistaa sen: `auto it = m.find(k); if (it != m.end())`. C++17 lyhenne?

## Tilanne

Verbose lookup:

```cpp
auto it = users.find(id);
if (it != users.end()) {
    use(it->second);
}
```

It-erillinen if:stä — helppo kirjoittaa `it` väärään scopeen myöhemmin.

## Ratkaisu

**If init-statement** (C++17):

```cpp
if (auto it = users.find(id); it != users.end()) {
    use(it->second);
}
```

`it` rajattu if:n scopeen — ei vuoda ulos. Sama optional, lock_guard-patterneille.

## Käytännössä

```cpp
if (std::lock_guard lock(m); ready) { /* ... */ }
```

CppCoreGuidelines: prefer scoped init. Luettavuus parempi kuin erillinen declare + if.

[Lue lisää](https://en.cppreference.com/w/cpp/language/if#If_statements_with_initializer)

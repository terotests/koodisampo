# Tuotantobugi: mutex jää lukittuna poikkeuksen jälkeen. Miten estät tämän modernisti?

**Ratkaisu:** RAII-lukitsin — `std::lock_guard` tai `std::scoped_lock`. Lukko vapautuu automaattisesti myös poikkeuksessa.

```cpp
std::lock_guard lock(m);
// kriittinen alue
```

Älä käytä raakaa `lock()` / `unlock()` ilman RAII:ta.

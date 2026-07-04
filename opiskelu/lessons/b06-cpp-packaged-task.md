# Worker-thread ajaa funktion ja palauttaa tuloksen kutsijalle. Mitä käytät future-pohjaisesti?

**Ratkaisu:** `std::async`, `std::packaged_task` tai `std::promise` + `std::future`.

```cpp
auto fut = std::async(std::launch::async, [] { return heavy(); });
int result = fut.get();
```

`future` siirtää tuloksen tai poikkeuksen takaisin kutsujalle.

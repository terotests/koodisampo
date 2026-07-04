# Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa?

**Ratkaisu:** `std::jthread` + `std::stop_token` — destructor kutsuu `request_stop()`, worker tarkistaa `stop_token` loopissa.

```cpp
std::jthread worker([](std::stop_token st) {
    while (!st.stop_requested()) { /* ... */ }
});
```

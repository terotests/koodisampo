# Rakennat isoja olioita suoraan vectoriin väliaikaisten kopioiden sijaan. Mikä metodi?

**Ratkaisu:** `emplace_back` rakentaa alkion suoraan vectorin muistiin. Yhdistä `reserve(n)` kun määrä tiedossa.

```cpp
widgets.reserve(1000);
widgets.emplace_back("gui", 42);
```

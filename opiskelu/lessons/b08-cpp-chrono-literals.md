# Timeout-koodi: `sleep(500)` — yksikkö epäselvä. Miten ilmaiset 500 millisekuntia C++14:ssä?

## Tilanne

Legacy timeout:

```cpp
sleep(500);        // sekuntia? millisekuntia?
Sleep(500);        // Windows ms — eri API
std::this_thread::sleep_for(???);
```

Magic number ilman yksikköä — code reviewissa arvaus. Sekunti vs millisekunti -virhe on 1000× virhe tuotannossa (timeout liian lyhyt/pitkä).

## Ratkaisu

**`std::chrono` literals** (C++14):

```cpp
using namespace std::chrono_literals;

std::this_thread::sleep_for(500ms);
auto timeout = 500ms;
auto deadline = std::chrono::steady_clock::now() + 500ms;
```

Tyypitetty aika — kääntäjä tarkistaa yksiköt. `500ms`, `2s`, `100us` ovat eri tyyppejä (`milliseconds`, `seconds`).

## Käytännössä

Prefer `chrono` kaikissa timeout/deadline-koodeissa. `steady_clock` mittaukseen (ei hyppää kellon siirroissa). CppCoreGuidelines: use chrono, not magic integers.

[Lue lisää](https://en.cppreference.com/w/cpp/chrono/operator%22%22ms)

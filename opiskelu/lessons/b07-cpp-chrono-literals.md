# Timeout on koodissa sleep(500) — yksikkö epäselvä. Miten std::chrono ilmaisee 500 millisekuntia?

## Tilanne

```cpp
sleep(500);  // sekuntia? ms?
```

Magic number ilman yksikköä — review-arvaus, tuotantovirhe 1000×.

## Ratkaisu

```cpp
using namespace std::chrono_literals;
std::this_thread::sleep_for(500ms);
```

Tyypitetty aika — kääntäjä tarkistaa yksiköt.

## Käytännössä

`steady_clock` mittauksiin. API: ota `chrono::milliseconds` parametreina. CppCoreGuidelines: no magic time numbers.

[Lue lisää](https://en.cppreference.com/w/cpp/chrono/operator%22%22ms)

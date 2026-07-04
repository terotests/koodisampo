# Worker-thread ajaa funktion ja palauttaa tuloksen kutsijalle. Mitä käytät future-pohjaisesti?

## Tilanne

Pääsäie delegoi raskaan laskennan taustalle ja tarvitsee tuloksen tai poikkeuksen myöhemmin. Raaka `std::thread` + jaettu muuttuja ilman synkronointia on data race. Callback-ketju ilman standardia sopimusta monimutkaistuu nopeasti.

Tarvitaan standardoitu tapa siirtää arvo tai virhe säikeestä toiseen.

## Ratkaisu

Kolme yleistä työkalua:

```cpp
// 1. std::async — yksinkertaisin
auto fut = std::async(std::launch::async, [] { return heavyCompute(); });
int result = fut.get();

// 2. std::packaged_task — sidottu funktioon, ajetaan omassa threadissa
std::packaged_task<int()> task([] { return heavyCompute(); });
auto fut = task.get_future();
std::thread t(std::move(task));
t.join();

// 3. std::promise / std::future — manuaalinen täyttö
std::promise<int> prom;
auto fut = prom.get_future();
std::thread([&] { prom.set_value(42); }).detach();
```

`future::get()` blokkaa kunnes tulos on valmis ja **propagoi poikkeuksen** worker-säikeestä.

## Valinta

- Yksittäinen tehtävä, ei tarkkaa thread-kontrollia → `std::async`.
- Thread pool tai oma jonotus → `packaged_task` + `future`.
- Monimutkainen handshake → `promise`/`future` pari.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/future)

# Yksinkertainen shutdown-flag jaettiin bool:lla ilman synkronointia — satunnainen jumi. Ratkaisu?

## Tilanne

Worker-säie odottaa shutdownia:

```cpp
bool running = true;

void worker() {
    while (running) { /* ... */ }
}

void shutdown() {
    running = false;  // data race — UB
}
```

`bool` lukeminen yhdestä säikeestä ja kirjoitus toisesta ilman synkronointia on **data race** — undefined behavior. Satunnainen jumi: worker ei koskaan pysähdy tai optimointi cachettaa `running = true` ikuisesti.

## Ratkaisu

**`std::atomic<bool>`**:

```cpp
std::atomic<bool> running{true};

void worker() {
    while (running.load(std::memory_order_acquire)) { /* ... */ }
}

void shutdown() {
    running.store(false, std::memory_order_release);
}
```

Yksinkertaiseen flagiin `memory_order_relaxed` voi riittää molemmissa — acquire/release varmistaa näkyvyyden shutdown-signaalille.

## Käytännössä

C++20: `std::jthread` + `stop_token` korvaa manuaalisen flagin. TSan löytää bool-racet testeissä. CppCoreGuidelines CP.2: minimize shared mutable state.

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/atomic)

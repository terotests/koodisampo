# Uusi moduuli käyttää suoraan `pthread_create` / `CreateThread`. Mitä cpp-best-practices suosittelee?

## Tilanne

Platform-spesifinen säie:

```cpp
#ifdef _WIN32
    CreateThread(...);
#else
    pthread_create(...);
#endif
```

Join, detach, stack size — eri API jokaisella alustalla. Virheellinen cleanup → resource leak tai crash.

## Ratkaisu

**`std::thread`** (C++11) tai **`std::jthread`** (C++20):

```cpp
std::jthread worker([](std::stop_token st) {
    while (!st.stop_requested()) { /* ... */ }
});  // destructor request_stop + join
```

Portable abstraktio — kääntäjä mapittaa pthread/Win32. `jthread` siisti shutdown `stop_token`:lla.

## Käytännössä

Prefer `jthread` uudessa koodissa. Thread pool: `std::async` tai kirjasto (TBB). CppCoreGuidelines: don't roll own thread wrapper unless necessary.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/jthread)

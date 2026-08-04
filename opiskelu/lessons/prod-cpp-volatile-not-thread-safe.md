# Kaksi säiettä jakaa `volatile bool done` -lipun. Miksi tämä ei takaa thread-safetyä?

## Tilanne

```cpp
volatile bool done = false;

// säie A
done = true;

// säie B
while (!done) { /* spin */ }
```

`volatile` estää kääntäjää optimoimasta lukua pois rekisteristä — hyödyllistä laiterekistereille. Se **ei** takaa atomista kirjoitusta/lukua eikä memory orderingia säikeiden välillä. Data race on edelleen UB.

## Ratkaisu

Käytä `std::atomic`:

```cpp
std::atomic<bool> done{false};
done.store(true, std::memory_order_release);
while (!done.load(std::memory_order_acquire)) {
  // ...
}
```

Tai ehdollinen odotus `std::condition_variable` + mutex, jos busy-wait ei ole tavoite.

## Käytännössä

- `volatile` ≠ synkronointi. C++-standardissa thread-safetyyn käytetään `std::atomic`, mutexia tai muuta sync-primitiiviä.
- TSan löytää `volatile`-liput helposti raceina.
- Laiterekisterit / signal handler -erikoistapaukset ovat eri kategoria — älä kopioi sitä threndiin.

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/atomic)

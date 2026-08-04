# Release-build toimii, mutta TSan löytää data racen kahden säikeen välillä. Miksi mutex tarvitaan?

## Tilanne

Kaksi säiettä lukee/kirjoittaa samaa muuttujaa ilman synkronointia. Release-build "toimii koneellani" — ajoitus sattuu peittämään bugin. ThreadSanitizer (TSan) instrumentoi muistiin pääsyt ja raportoi data racen. Tiimi epäilee false positivea, koska tuotanto ei ole kaatunut… vielä.

## Ratkaisu

C++-muistimalli: **data race = undefined behavior (UB)**. Kääntäjä saa optimoida oletuksella, ettei raceja ole. "Toimii" ei ole määriteltyä käyttäytymistä. Korjaus:

```cpp
std::mutex m;
{
  std::lock_guard lock(m);
  shared_state = ...;
}
// tai
std::atomic<int> counter{0};
counter.fetch_add(1, std::memory_order_relaxed);
```

Mutex (tai muu synkronointi) / `std::atomic` luo happens-before -suhteen. TSan hiljenee, kun race on poistettu.

## Käytännössä

- Aja TSan CI:ssä debug/asan-tyylisellä buildilla (`-fsanitize=thread`). Älä etsi raceja vain release-optimoidusta binääristä.
- `volatile` ei korvaa atomicsia tai mutexia.
- Race voi ilmetä vain tietyllä CPU:lla, kuormalla tai compiler-versiolla — siksi sanitizerit.

[Lue lisää](https://clang.llvm.org/docs/ThreadSanitizer.html)

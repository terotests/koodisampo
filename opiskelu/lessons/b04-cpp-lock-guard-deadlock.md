# Kaksi mutexia lukitaan eri järjestyksessä kahdessa säikeessä — satunnainen deadlock. Mikä standardiratkaisu auttaa?

## Tilanne

Kaksi tiliä, kaksi mutexia:

```cpp
void transfer(Account& from, Account& to) {
    std::lock_guard lk1(from.mtx);
    std::lock_guard lk2(to.mtx);  // järjestys riippuu parametreista
}

// Säie A: transfer(a, b)  — lukitsee a, odottaa b
// Säie B: transfer(b, a)  — lukitsee b, odottaa a → deadlock
```

Klassinen deadlock: eri lukitusjärjestys. `scoped_lock` (C++17) ratkaisee yhdellä mutex-parilla — mutta perinteinen tapa on `std::lock`.

## Ratkaisu

**`std::lock(m1, m2)`** lukitsee atomisesti (sisäinen deadlock-turvallinen järjestys):

```cpp
void transfer(Account& from, Account& to) {
    std::lock(from.mtx, to.mtx);
    std::lock_guard lk1(from.mtx, std::adopt_lock);
    std::lock_guard lk2(to.mtx, std::adopt_lock);
}
```

C++17 helpompi: `std::scoped_lock lock(from.mtx, to.mtx);`

## Käytännössä

Prefer `scoped_lock` uudessa koodissa. Vaihtoehto: kiinteä globaali järjestys (aina pienemmän osoitteen mutex ensin). CppCoreGuidelines CP.50.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/lock)

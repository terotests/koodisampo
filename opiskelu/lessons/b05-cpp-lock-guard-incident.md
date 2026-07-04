# Tuotantobugi: mutex jää lukittuna poikkeuksen jälkeen. Miten estät tämän modernisti?

## Tilanne

Kriittinen alue suojataan raa'alla `mutex.lock()` / `mutex.unlock()` -parilla. Poikkeus kesken alueen hypätään yli `unlock()`:sta — mutex jää lukittuna. Seuraava säie jää odottamaan ikuisesti; palvelu jumiutuu hiljaa.

Tämä on klassinen syy siihen, miksi C++-koodissa ei pitäisi koskaan käyttää manuaalista lukitusta ilman RAII:ta.

## Ratkaisu

Käytä RAII-lukitsinta — `std::lock_guard` tai `std::scoped_lock`:

```cpp
void updateSharedState() {
    std::lock_guard lock(mutex_);
    shared_.value = compute();  // poikkeus → destructor vapauttaa lukon
}
```

Lukitsimen destructor kutsuu `unlock()` automaattisesti myös stack unwinding -tilanteessa. Usealle mutexille: `std::scoped_lock`.

## Käytännössä

`unique_lock` tarvitaan vain kun tarvitset ehdollista lukitusta, `try_lock` tai condition variable -odotusta. Tavalliseen kriittiseen alueeseen `lock_guard` on yksinkertaisin ja turvallisin.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/lock_guard)

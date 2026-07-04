# Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu?

## Tilanne

Funktio päivittää kahden jaetun resurssin tilaa ja lukitsee molemmat mutexit:

```cpp
void transfer(Account& from, Account& to) {
    std::lock_guard lk1(from.mutex);
    std::lock_guard lk2(to.mutex);
    // ...
}
```

Jos toinen säie kutsuu `transfer(to, from)`, lukitusjärjestys kääntyy: säie A pitää `from` ja odottaa `to`, säie B pitää `to` ja odottaa `from` — klassinen deadlock.

## Ratkaisu

C++17 `std::scoped_lock` lukitsee usean mutexin **atomisesti** ja käyttää sisäistä deadlock-turvallista järjestystä:

```cpp
void transfer(Account& from, Account& to) {
    std::scoped_lock lock(from.mutex, to.mutex);
    from.balance -= amount;
    to.balance += amount;
}
```

Sama kuin `std::lock(m1, m2)` + `lock_guard`, mutta yhdellä RAII-ololla. Vaihtoehto vanhemmassa C++:ssa: kiinteä globaali lukitusjärjestys (esim. aina pienemmän osoitteen mutex ensin) tai refaktoroi yhdeksi mutexiksi.

## Käytännössä

`scoped_lock` ratkaisee järjestysongelman, ei kuitenkaan pitkää kriittistä aluetta — pidä lukitusalue mahdollisimman lyhyenä. Jos tarvitset vain yhden mutexin, `lock_guard` riittää.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/scoped_lock)

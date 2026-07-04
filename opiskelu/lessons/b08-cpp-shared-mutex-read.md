# Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi?

## Tilanne

Palvelu lukee jaettua konfiguraatiota jokaisella requestilla. Päivitys tapahtuu harvoin (minuutti- tai tuntitasolla). `std::mutex` + `lock_guard` serialisoi **kaikki** lukijat toistensa takana — skaalautuvuus kärsii, vaikka kukaan ei kirjoita.

Tämä on klassinen readers-writers -ongelma.

## Ratkaisu

`std::shared_mutex` sallii useita samanaikaisia lukijoita, mutta vain yhden kirjoittajan:

```cpp
class ConfigCache {
    mutable std::shared_mutex mtx_;
    Config data_;

public:
    Config get() const {
        std::shared_lock lock(mtx_);
        return data_;
    }

    void update(Config cfg) {
        std::unique_lock lock(mtx_);
        data_ = std::move(cfg);
    }
};
```

`shared_lock` = jaettu lukitus lukemiseen. `unique_lock` = yksinomistajuus kirjoitukseen.

## Huomio

`shared_mutex` on raskaampi kuin tavallinen `mutex` yksittäisille lukijoille — hyöty tulee vasta kun lukijoita on paljon ja kirjoituksia vähän. Jos kirjoituksia on usein, tavallinen mutex voi olla yksinkertaisempi. Varmista myös, että palautettu `Config` on turvallinen kopio — älä palauta viittausta suojatun datan alle.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/shared_mutex)

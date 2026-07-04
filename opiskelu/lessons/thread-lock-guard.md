# Mikä on turvallisin tapa lukita `std::mutex` lyhyeksi kriittiseksi alueeksi?

## Tilanne

Jaettu cache päivitetään säikeistä:

```cpp
std::mutex m;
Cache cache;

void update(const Entry& e) {
    m.lock();
    cache.insert(e);
    if (someCondition(e)) {
        m.unlock();  // BUG — early return unohtaa unlock
        return;
    }
    m.unlock();
}
```

Raaka `lock()` / `unlock()` vaatii jokaisen polun vapauttavan lukon. Poikkeus kesken kriittistä aluetta → **deadlock** seuraavalla kerralla. Tuotantobugi: palvelu jää jumiin satunnaisesti.

## Ratkaisu

**RAII-lukitsin** — `std::lock_guard` (C++11) tai `std::scoped_lock` (usealle mutexille):

```cpp
void update(const Entry& e) {
    std::lock_guard lock(m);
    cache.insert(e);
    if (someCondition(e)) return;
}  // lukko vapautuu automaattisesti — myös poikkeuksessa
```

Destruktori vapauttaa aina. Pitkä kriittinen alue: `std::unique_lock` + `condition_variable`. C++17 usealle mutexille: `std::scoped_lock lock(m1, m2)`.

## Käytännössä

CppCoreGuidelines CP.20: "Use RAII, never plain lock()/unlock()." Review: hylkää raaka lock ilman RAII:ta. TSan auttaa löytämään jäljellä olevat race:t.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/lock_guard)

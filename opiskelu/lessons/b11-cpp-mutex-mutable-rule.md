# const-metodi päivittää cachea mutta tarvitsee mutexin. Mitä cpp-best-practices M&M-sääntö tarkoittaa?

## Tilanne

```cpp
class Service {
    mutable std::mutex cacheMutex_;
    mutable std::optional<Data> cache_;
public:
    Data get() const {
        std::lock_guard lock(cacheMutex_);  // mutex mutable
        // ...
    }
};
```

`const` metodi ei saa lukita ei-mutable mutexia — **`mutable`** mutex (ja cache) sallii logical const.

## Ratkaisu

**`mutable` jäsen** + mutex lazy-cacheen:

```cpp
mutable std::mutex cacheMutex_;
mutable std::optional<Data> cache_;
```

Logical const: ulkoisesti const, sisäinen cache päivittyy. Mutex **mutable** jotta const-metodi voi lukita.

## Käytännössä

Älä väärinkäytä mutable — vain cache, lazy init, mutex. CppBestPractices Threadability. CppCoreGuidelines Con.16.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/07-Considering_Threadability.md)

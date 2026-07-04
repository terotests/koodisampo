# Funktion sisällä `static Logger log;` — useat säikeet kirjoittavat lokille. C++11 jälkeen static local init?

## Tilanne

```cpp
Logger& getLogger() {
    static Logger log;  // lazy init
    return log;
}
```

Usea säie kutsuu ensimmäistä kertaa — kilpailu alustuksesta? C++11 **magic statics**: static local init on **thread-safe** (kerran).

## Ratkaisu

Static local init thread-safe — mutta **Logger itse** tarvitsee synkan kirjoitukselle:

```cpp
Logger& getLogger() {
    static Logger log;  // init thread-safe
    return log;
}
// Logger::write() sisäisesti mutex
```

Init kerran vs concurrent write — eri ongelmat.

## Käytännössä

Singleton: static local ok C++11+. Concurrent access: suojaa Logger mutexilla. CppCoreGuidelines CP.44.

[Lue lisää](https://en.cppreference.com/w/cpp/language/storage_duration#Static_local_variables)

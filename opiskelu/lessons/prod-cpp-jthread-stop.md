# Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa?

## Tilanne

Luokka käynnistää worker-säikeen konstruktorissa:

```cpp
class Service {
    std::thread worker_;
public:
    Service() { worker_ = std::thread([this] { loop(); }); }
    ~Service() { /* ??? */ }
};
```

Jos destructor ei joinaa tai signaloi pysäytystä, `std::terminate` kutsutaan (`thread` edelleen joinable). `detach()` jättää säikeen eloon — UB jos `this` tuhoutuu.

## Ratkaisu

C++20 `std::jthread` + `std::stop_token`:

```cpp
class Service {
    std::jthread worker_;
public:
    Service()
        : worker_([](std::stop_token st) {
              while (!st.stop_requested()) {
                  doWork();
              }
          }) {}

    // ~Service() request_stop() + join automaattisesti
};
```

`jthread`-destructor kutsuu `request_stop()` ja joinaa. Worker tarkistaa `stop_token` loopissa ja poistuu siististi.

## Vanhempi C++

`std::thread` + atomi `shutdown`-flag + `join()` destructorissa. `jthread` paketoi saman standardiin tavalla.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/jthread)

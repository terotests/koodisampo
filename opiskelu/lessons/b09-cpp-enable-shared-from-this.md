# Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern?

## Tilanne

Luokka rekisteröi async-callbackin, joka kutsutaan myöhemmin. Callback tarvitsee elävän `this`-osoitteen. Kehittäjä kirjoittaa:

```cpp
scheduler.post([this] { process(); });
// tai pahempi:
auto p = std::shared_ptr<MyClass>(this);
```

Jos olio tuhoutuu ennen callbackia → dangling `this`. `shared_ptr(this)` luo **toisen control blockin** samalle osoitteelle → double delete kun alkuperäinen `shared_ptr` tuhoutuu.

## Ratkaisu

Peri `std::enable_shared_from_this<T>` ja käytä `shared_from_this()`:

```cpp
class Worker : public std::enable_shared_from_this<Worker> {
public:
    void start() {
        scheduler.post([self = shared_from_this()] { self->process(); });
    }
};

// olio LUODAAN aina shared_ptr:in kautta:
auto w = std::make_shared<Worker>();
w->start();
```

`shared_from_this()` palauttaa kopion olemassa olevasta `shared_ptr`-omistuksesta — yksi control block, turvallinen elinikä callbackin ajaksi.

## Ehto

`enable_shared_from_this` toimii vain kun olio on jo `shared_ptr`:n hallinnassa. Stack-allokoitu olio + `shared_from_this()` heittää `bad_weak_ptr`.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/enable_shared_from_this)

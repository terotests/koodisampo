# Coroutine käyttää viittausta paikalliseen muuttujaan `co_await` jälkeen. Mikä riski?

## Tilanne

```cpp
task<void> bad() {
    std::string msg = "hello";
    auto& ref = msg;
    co_await something();  // coroutine suspend
    use(ref);  // msg voi olla tuhottu — dangling
}
```

Coroutine **jatkua myöhemmin** — stack frame voi olla invalid suspendin jälkeen. Viittaus paikalliseen muuttujaan `co_await`:n jälkeen on klassinen lifetime-bugi.

## Ratkaisu

Älä viittaa paikallisiin **`co_await`:n yli**:

```cpp
task<void> good() {
    auto msg = std::make_shared<std::string>("hello");
    co_await something();
    use(*msg);  // elää heapilla
}
```

Tai kopioi arvo ennen suspendia. Coroutine frame elää eri tavalla kuin tavallinen funktio.

## Käytännössä

CppCoreGuidelines: lifetime coroutineissa on vaikea — code review erityisen tarkka. Prefer value types, shared ownership, tai parametrit frameen. C++20 coroutines vaativat asiantuntemusta.

[Lue lisää](https://en.cppreference.com/w/cpp/language/coroutines)

# Coroutine ottaa parametrin `const std::string&` ja käyttää sitä `co_await`:n jälkeen. Kutsujan merkkijono on väliaikainen. Mikä riski?

## Tilanne

```cpp
task<void> bad(const std::string& msg) {
    co_await something();  // coroutine suspend
    use(msg);  // kutsujan merkkijono voi olla jo tuhottu — dangling
}

auto t = bad(std::string("hello"));  // väliaikainen tuhoutuu lausekkeen lopussa
```

Coroutine **jatkuu myöhemmin**, usein vasta kun kutsuja on jo palannut. Coroutinen omat paikalliset muuttujat elävät coroutine framessa ja säilyvät suspendin yli, mutta frame tallentaa viittausparametrista vain viittauksen — ei viitattua oliota. Jos kutsujan olio (tai väliaikainen) tuhoutuu ennen jatkamista, viittaus roikkuu.

## Ratkaisu

Ota parametrit **arvona**, jos coroutine voi suspendoitua:

```cpp
task<void> good(std::string msg) {  // kopio/move coroutine frameen
    co_await something();
    use(msg);  // elää framen mukana
}
```

Sama koskee `std::string_view`-, `std::span`- ja osoitinparametreja sekä lambda-coroutineja, jotka kaappaavat viittauksella. Jaettu omistus (`std::shared_ptr`) on vaihtoehto, kun kopio on liian kallis.

## Käytännössä

CppCoreGuidelines: lifetime coroutineissa on vaikea — code review erityisen tarkka. Suosi arvoparametreja tai jaettua omistusta; viittausparametri coroutinessa on review-lippu. C++20-coroutinet vaativat asiantuntemusta.

[Lue lisää](https://en.cppreference.com/w/cpp/language/coroutines)

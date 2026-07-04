# Miksi `std::make_shared<T>(args)` on parempi kuin `shared_ptr<T>(new T(args))`?

## Tilanne

Jaettu omistajuus `std::shared_ptr`:llä vaatii kaksi muistialuetta: itse olion ja control blockin (refcount). Kirjoitus `auto p = std::shared_ptr<Foo>(new Foo(x));` tekee kaksi erillistä allokaatiota. Jos `Foo`-konstruktori heittää poikkeuksen ennen kuin `shared_ptr` on rakennettu, voi syntyä vuoto (harvinainen, mutta mahdollinen ilman make_-factorya).

## Ratkaisu

`std::make_shared<Foo>(args)` allokoi olion ja control blockin **yhdellä kertaa**:

```cpp
auto widget = std::make_shared<Widget>(config);
```

Hyödyt: vähemmän allokaatioita, parempi cache-locality, exception-safe factory, vähemmän fragmentaatiota. Tämä on oletustapa, kun custom deleteriä ei tarvita.

## Poikkeus

Jos tarvitset custom deleterin (`shared_ptr<FILE>(f, fclose)`), `make_shared` ei sovi suoraan — käytä `shared_ptr` + erillinen deleter. Myös `enable_shared_from_this` -luokat luodaan lähes aina `make_shared`:lla, jotta control block on yksi.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared)

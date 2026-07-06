# Koodikatselmassa ehdotetaan tiimin coding-standardiin sääntöä: merkitse jokainen move-konstruktori `noexcept`, myös ne jotka allokoivat muistia. Mikä on riski, jos allokoiva move silti heittää ajonaikana?

## Tilanne

```cpp
class Blob {
public:
    Blob(Blob&& other) noexcept  // allokoi uudessa bufferissa — voi silti heittää!
        : data_(new int[other.size_]) {
        std::copy_n(other.data_, other.size_, data_);
    }
private:
    int* data_;
    size_t size_;
};
```

`noexcept` ei ole pelkkä dokumentaatio tai käännösaikainen ohje — se on **ajonaikainen sopimus**.

## Miksi tämä on vaarallista

Jos `noexcept`-merkitty funktio silti heittää poikkeuksen, C++ standardi vaatii kutsumaan **`std::terminate()`** — ohjelma kaatuu välittömästi, poikkeusta ei voi ottaa kiinni edes ulkopuolisella `try`/`catch`:lla.

```cpp
std::vector<Blob> v;
v.push_back(Blob{});
v.push_back(Blob{});  // reallokointi käyttää noexcept move — jos se heittää: terminate()
```

Kääntäjä **ei tarkista** onko `noexcept`-lupaus totta — se luottaa kirjoittajaan.

## Ratkaisu

Merkitse `noexcept` vain funktioille, jotka **todistettavasti eivät voi heittää** (esim. pointer-swap ei allokoi):

```cpp
Blob(Blob&& other) noexcept
    : data_(std::exchange(other.data_, nullptr)), size_(other.size_) {}
```

Jos move voi allokoida (kuten kopioivassa esimerkissä yllä), **älä** merkitse sitä `noexcept` — anna vectorin kopioida turvallisesti sen sijaan.

## Käytännössä

`noexcept`-merkintä on sopimus, ei toive. Väärä lupaus näkyy vasta tuotannossa, kun poikkeus todella heitetään — silloin ohjelma kaatuu hallitsemattomasti. CppCoreGuidelines E.16-E.19 käsittelee noexcept-sopimuksia tarkemmin.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

# Koodikatselmassa `Blob`-luokalla on move-konstruktori, joka siirtää `data_`-pointerin `std::exchange`:llä. Silti `std::vector<Blob>` kopioi elementit reallokoinnissa. Mitä move-operaattorin määrittelyyn lisätään?

## Tilanne

```cpp
class Blob {
public:
    Blob(Blob&& other)
        : data_(std::exchange(other.data_, nullptr)) {}
private:
    int* data_ = nullptr;
};

std::vector<Blob> v;
v.push_back(Blob{});
v.push_back(Blob{});  // reallokointi — odotit siirtoa, tapahtuu kopiointi
```

Move on toteutettu, eikä pointer-swap voi heittää — miksi vector silti kopioi?

## Miksi vector kopioi?

Vector ei lue move-toteutustasi. Se päättää reallokoinnissa **`std::move_if_noexcept`**:n perusteella:

- move **merkitty** `noexcept` → siirto
- move **ei** merkitty `noexcept` → vector olettaa heittävän move:n ja **kopioi** (strong exception guarantee)

Käsin kirjoitettu move ilman `noexcept`-merkintää ei ole `nothrow move constructible`, vaikka toteutus ei heittäisi.

## Ratkaisu

Lisää **`noexcept`** move-konstruktorin määrittelyyn:

```cpp
Blob(Blob&& other) noexcept
    : data_(std::exchange(other.data_, nullptr)) {}
```

Nyt vector saa luvan siirtää reallokoinnissa.

## Käytännössä

Merkitse `noexcept` vain jos totta. Jos move voi heittää (esim. allokaatio), **jätä** merkintä pois — vector kopioi silloin turvallisesti. Väärä `noexcept`-lupaus on vaarallinen. CppCoreGuidelines C.66.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

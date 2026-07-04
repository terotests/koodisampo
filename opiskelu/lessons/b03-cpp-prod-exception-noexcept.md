# Move-operaattori heittää poikkeuksen — std::vector reallokoi kesken ja tila epävarma. Mitä merkitset?

## Tilanne

Luokka `Blob` hallitsee resurssia. Move-konstruktori voi heittää (esim. allokaatio uudessa bufferissa). `std::vector<Blob>` kasvaa: reallokointi **moveaa** elementtejä. Jos move heittää kesken siirron, vectorin strong exception guarantee voi rikkoutua — osa elementeistä siirretty, osa ei.

Siksi vector käyttää movea vain, kun se on **noexcept**.

## Ratkaisu

Merkitse move-operaatiot `noexcept`, kun ne eivät voi heittää:

```cpp
class Blob {
public:
    Blob(Blob&& other) noexcept
        : data_(std::exchange(other.data_, nullptr)) {}

    Blob& operator=(Blob&& other) noexcept {
        if (this != &other) {
            delete data_;
            data_ = std::exchange(other.data_, nullptr);
        }
        return *this;
    }
};
```

Jos move voi heittää, vector kopioi sen sijaan — hitaampaa mutta turvallista.

## Käytännössä

`std::vector`, `std::swap` ja monet kontit valitsevat move vs copy noexcept-tiedon perusteella. `noexcept` move on suorituskyky- ja turvallisuusvaatimus tuotantokonttien kanssa.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

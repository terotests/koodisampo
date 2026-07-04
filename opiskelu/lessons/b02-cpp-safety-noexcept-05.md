# std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — tila epävarma. Miten merkitset move-operaattorin?

## Tilanne

```cpp
class Blob {
public:
    Blob(Blob&& other) { /* voi heittää allokaatiossa */ }
};

std::vector<Blob> v;
v.push_back(Blob{});  // reallokointi — jos move heittää, voi rikkoa guarantee
```

Vector valitsee **move vs copy** `noexcept`-tiedon perusteella. Heittävä move → vector kopioi turvallisuuden vuoksi.

## Ratkaisu

**`noexcept` move** kun ei voi heittää:

```cpp
Blob(Blob&& other) noexcept
    : data_(std::exchange(other.data_, nullptr)) {}
```

Pointer-swap ei heitä. Vector käyttää movea reallokoinnissa — nopeampi.

## Käytännössä

Merkitse `noexcept` vain jos totta. `noexcept(false)` default moveille, jotka voivat heittää. CppCoreGuidelines C.66.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

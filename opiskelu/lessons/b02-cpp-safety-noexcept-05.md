# `std::vector` siirtää elementtejä reallokoinnissa vain, jos move on `noexcept`; muuten se kopioi. Move ei voi heittää (esim. pointer-swap). Miten merkitset move-operaattorin?

## Tilanne

```cpp
class Blob {
public:
    Blob(Blob&& other) noexcept
        : data_(std::exchange(other.data_, nullptr)) {}
private:
    int* data_ = nullptr;
};

std::vector<Blob> v;
v.push_back(Blob{});  // reallokointi — vector siirtää, koska move on noexcept
```

Jos move **ei** ole `noexcept`, vector **kopioi** elementit turvallisuuden vuoksi (`std::move_if_noexcept`). Heittävä move reallokoinnissa olisi vaarallista vain, jos olisit **väärin** merkinnyt sen `noexcept`.

## Ratkaisu

Merkitse move **`noexcept`**, kun se ei voi heittää:

```cpp
Blob(Blob&& other) noexcept
    : data_(std::exchange(other.data_, nullptr)) {}
```

Pointer-swap ei heitä. Vector saa luvan siirtää reallokoinnissa — nopeampi kuin kopiointi.

## Käytännössä

Merkitse `noexcept` vain jos totta. Jos move voi heittää (esim. allokaatio), **jätä** `noexcept` pois — vector kopioi silloin turvallisesti. CppCoreGuidelines C.66.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

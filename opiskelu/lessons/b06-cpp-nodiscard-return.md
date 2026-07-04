# Tuotantobugi: `allocateBuffer()` palautusarvo jätetään huomiotta ja resurssi vuotaa. Miten estät?

## Tilanne

```cpp
Buffer* allocateBuffer(size_t n);
void setup() {
    allocateBuffer(1024);  // paluuarvo ignoroitu — leak
}
```

Sama ongelma kuin `validate()` — helppo unohtaa paluuarvo. Tuotanto vuotaa tai jättää resurssin alustamatta.

## Ratkaisu

**`[[nodiscard]]`**:

```cpp
[[nodiscard]] std::unique_ptr<Buffer> allocateBuffer(size_t n);
```

Ignoroitu paluuarvo → kääntäjävaroitus/-virhe. Prefer `unique_ptr` — omistus selkeä.

## Käytännössä

Merkitse nodiscard funktioille, joiden tulos on olennainen: alloc, parse, lock try, error codes. C++20 std nodiscard types. CppCoreGuidelines F.6.

[Lue lisää](https://en.cppreference.com/w/cpp/language/attributes/nodiscard)

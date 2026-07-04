# std::vector<MyType> kasvaa hitaasti vaikka move-operaattori on olemassa. Todennäköisin syy?

## Tilanne

Profileri: vector reallokointi kopioi `MyType`:jä, ei movea. Move-operaattori on kirjoitettu — miksi copy?

```cpp
class MyType {
public:
    MyType(MyType&& other) { /* voi heittää */ }
};
```

**Syy:** move **ei ole `noexcept`**. Vector kopioi exception safety -syistä reallokoinnissa.

## Ratkaisu

Merkitse move **`noexcept`**:

```cpp
MyType(MyType&& other) noexcept { /* ... */ }
```

Tarkista: `static_assert(std::is_nothrow_move_constructible_v<MyType>);`

## Käytännössä

Yleisin syy hitaaseen vector-kasvuun move-tyypeillä. CppCoreGuidelines C.66. Profiloi ennen/jälkeen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

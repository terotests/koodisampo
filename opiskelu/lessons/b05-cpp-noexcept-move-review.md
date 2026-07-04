# Code review: move-konstruktori ei ole noexcept. `std::vector` resize hidastuu. Miksi?

## Tilanne

Move kirjoitettu ilman noexcept:

```cpp
MyType(MyType&& other) { /* voi heittää */ }
```

Vector reallokoi — valitsee **copy** exception guarantee -syistä. Profileri näyttää odottamattomia kopioita.

## Ratkaisu

Merkitse **`noexcept`** kun move ei heitä:

```cpp
MyType(MyType&& other) noexcept { /* pointer swap */ }
```

`static_assert(std::is_nothrow_move_constructible_v<MyType>);`

## Käytännössä

Yleisin syy vector-hitauteen move-tyypeillä. CppCoreGuidelines C.66.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

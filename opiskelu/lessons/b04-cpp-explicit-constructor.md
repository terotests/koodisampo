# Bugi: `void foo(Bytes b); foo(1024);` kääntyy — 1024 muuntuu Bytes:ksi implisiittisesti. Korjaus?

## Tilanne

Domain wrapper:

```cpp
class Bytes {
public:
    Bytes(size_t n) : count_(n) {}
};
void foo(Bytes b);
foo(1024);  // implisiittinen muunnos
```

Magic number muuttuu domain-tyypiksi ilman että kutsuja huomaa — yksikkövirheet, ylivuodot.

## Ratkaisu

**`explicit Bytes(size_t n)`**:

```cpp
explicit Bytes(size_t n) : count_(n) {}
foo(Bytes{1024});  // tietoinen
```

`explicit` estää implisiittisen muunnoksen kutsukohdassa.

## Käytännössä

Yksiparametriset konstruktorit `explicit` oletuksena. CppCoreGuidelines C.46.

[Lue lisää](https://en.cppreference.com/w/cpp/language/explicit)

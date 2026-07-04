# Tiimi kirjoittaa copy assignment -operaattorin käsin ja unohtaa self-assignmentin. Idiomivaihtoehto?

## Tilanne

```cpp
Buffer& operator=(const Buffer& o) {
    delete[] data_;
    data_ = new char[o.size_];  // self-assign x=x → delete own data first
    // ...
}
```

Self-assignment `a = a` tuhoaa datan ennen kopiota. Manuaalinen copy-assign on virhealtis.

## Ratkaisu

**Copy-and-swap**:

```cpp
Buffer& operator=(Buffer other) {  // pass by value — kopio
    swap(*this, other);
    return *this;
}
```

Self-assignment turvallinen. Strong exception guarantee jos copy heittää ennen muutosta.

## Käytännössä

`friend void swap` member swap. Rule of Five. CppCoreGuidelines C.62.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-copy-assignment)

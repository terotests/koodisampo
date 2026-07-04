# Luokka hallitsee dynaamista bufferia mutta määrittelee vain destructorin. Mikä puuttuu?

## Tilanne

```cpp
class Buffer {
    char* data_;
    size_t size_;
public:
    Buffer(size_t n) : data_(new char[n]), size_(n) {}
    ~Buffer() { delete[] data_; }
    // copy/move?
};
```

Oletusarvoiset copy-operaatiot kopioivat osoittimen — double delete. Oletusmove voi jättää lähde-olion epävalidiksi väärin. Puutteellinen Rule of Five on klassinen vuoto- ja kaatumislähde.

## Ratkaisu

Täydennä viisi operaatiota tai käytä Rule of Zero:

```cpp
// Rule of Five — custom hallinta
Buffer(const Buffer&) = delete;
Buffer& operator=(const Buffer&) = delete;
Buffer(Buffer&&) noexcept;
Buffer& operator=(Buffer&&) noexcept;
~Buffer();

// tai parempi — Rule of Zero:
class Buffer {
    std::vector<char> data_;  // vector hoitaa kaiken
};
```

Jokainen custom destructor → päätä copy/move/delete eksplisiittisesti.

## Käytännössä

`std::vector`, `std::string`, `unique_ptr` mahdollistavat Rule of Zero:n. Käsin hallittu `new[]` vaatii täyden viisikon tai `= delete` kopioinnille.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#c21)

# Luokka hallittee dynaamista bufferia — destructor on määritelty, mutta copy-assignment puuttuu. Tuotantobugi double-free. Periaate?

## Tilanne

```cpp
class Buffer {
    char* data_;
public:
    ~Buffer() { delete[] data_; }
    Buffer(const Buffer& o) { /* copy */ }
    // operator= puuttuu — default tekee shallow copy → double delete
};
```

Rule of Three/Five rikkoutuu — yksi special member puuttuu.

## Ratkaisu

**Rule of Five** — määrittele tai `= default`/`= delete` **kaikki viisi**:

```cpp
~Buffer();
Buffer(const Buffer&);
Buffer(Buffer&&) noexcept;
Buffer& operator=(const Buffer&);
Buffer& operator=(Buffer&&) noexcept;
```

Tai **Rule of Zero**: `std::vector<char> data_;` — jäsen hoitaa.

## Käytännössä

Custom destructor → tarkista copy/move. Copy-and-swap idiom. CppCoreGuidelines C.21, C.22.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-five)

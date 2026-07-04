# Luokassa on custom destructor mutta ei move-operaatioita. Mitä cpp-best-practices ehdottaa?

## Tilanne

```cpp
class Buffer {
    char* data_;
public:
    ~Buffer() { delete[] data_; }
    // move — implicitly deleted because destructor is user-declared?
};
```

User-declared destructor voi suppress move — jäljelle jää hitaat kopiot.

## Ratkaisu

**`= default` move** jos jäsenet tukevat:

```cpp
Buffer(Buffer&&) noexcept = default;
Buffer& operator=(Buffer&&) noexcept = default;
```

Tai Rule of Five käsin. Tarkista: move on olemassa ja noexcept.

## Käytännössä

`= default` move kun Rule of Zero ei mahdollinen. CppCoreGuidelines C.21. Profiloi vector reallokointia.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/08-Considering_Performance.md)

# Luokan API ottaa `std::span<int>` konstruktorissa ja tallentaa sen jäsenmuuttujaan myöhempää käyttöä varten. Mikä riski?

## Tilanne

```cpp
class Processor {
public:
    Processor(std::span<int> data) : data_(data) {}
    void runLater() { sum(data_); }  // data_ voi olla invalid
private:
    std::span<int> data_;
};

void demo() {
    std::vector<int> v{1, 2, 3};
    Processor p(v);
}  // v tuhoutuu — p.data_ dangling
```

**`span` ei omista dataa** — se on näkymä ulkoiseen bufferiin. Jos bufferi tuhoutuu ennen `span`:in käyttöä → UB, satunnainen crash.

## Ratkaisu

Omista data tarvittaessa:

```cpp
class Processor {
public:
    explicit Processor(std::vector<int> data) : data_(std::move(data)) {}
    std::span<const int> view() const { return data_; }
private:
    std::vector<int> data_;
};
```

Tai rajaa `span` vain funktion scopeen — älä tallenna jäseneksi ilman omistusta tai elinikäsopimusta (caller pitää bufferin elossa).

## Käytännössä

CppCoreGuidelines: span parametrina ok; span jäsenenä vain dokumentoidulla elinikäsopimuksella. Review: "Kuka omistaa bufferin?" C++20 `span` on työkalu — ei korvaa omistussuunnittelua.

[Lue lisää](https://en.cppreference.com/w/cpp/container/span)

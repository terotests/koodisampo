# Funktio ottaa `std::shared_ptr<Foo>` arvona ja kutsutaan jokaisella frame:lla. Miksi tämä on ongelma?

## Tilanne

```cpp
void render(std::shared_ptr<Texture> tex);

for (each frame) {
    render(tex);  // atomic ref count inc/dec joka frame
}
```

Pass-by-value **kopioi shared_ptr** — atomiset ref count operaatiot joka kutsulla. Hot loop → turhaa atomista kuormaa.

## Ratkaisu

**`const std::shared_ptr<Foo>&`** tai **`std::shared_ptr<Foo>` kerran**, **`Foo&`** jos elinikä taattu:

```cpp
void render(const std::shared_ptr<Texture>& tex);
```

Unique ownership transfer: `unique_ptr` by value. Shared read: const ref.

## Käytännössä

CppBestPractices Performance. `shared_ptr` vain kun jaettu omistus tarvitaan. Review: "const ref hot pathissa."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/08-Considering_Performance.md)

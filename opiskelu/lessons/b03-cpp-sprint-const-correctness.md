# Code review: getter palauttaa `std::string` kopiona vaikka dataa ei muuteta. Parannus?

## Tilanne

Luokan getter:

```cpp
class User {
public:
    std::string name() { return name_; }  // kopio joka kutsulla
private:
    std::string name_;
};

void display(const User& u) {
    log(u.name());  // EI käännä — name() ei ole const
}
```

Palautus arvona kopioi merkkijonon — turha allokaatio hot pathissa. Lisäksi getter ei ole `const`, joten sitä ei voi kutsua `const User&`:stä. API on sekä hitaampi että epäjohdonmukainen.

## Ratkaisu

Read-only pääsy **`const`-metodilla** ja viittauksella tai **`string_view`**:llä:

```cpp
class User {
public:
    const std::string& name() const { return name_; }
    // tai C++17+: std::string_view name() const { return name_; }
private:
    std::string name_;
};
```

Ei kopiota — kutsuja lukee olemassa olevaa dataa. `const` metodi lupaa olla muuttamatta olion tilaa.

## Käytännössä

Älä palauta `std::string` kopiona getteristä, ellei tarkoituksella eristä (defensive copy). `string_view` sopii, jos `name_` elää olion elinkaaren. CppBestPractices Style: const-correctness oletuksena.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)

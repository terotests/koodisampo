# Luokka ottaa konstruktorissa `std::string_view name` ja tallentaa sen suoraan jäseneksi. Mikä pitää varmistaa?

## Tilanne

```cpp
class Label {
public:
    Label(std::string_view name) : name_(name) {}
    std::string_view name() const { return name_; }
private:
    std::string_view name_;
};

Label makeLabel() {
    std::string temp = "temp";
    return Label(temp);  // temp tuhoutuu — name_ dangling
}
```

**`string_view` ei omista dataa** — se on näkymä. Jos lähde (`std::string`, literaali stackilla) tuhoutuu ennen `string_view`:n käyttöä → dangling reference, UB.

## Ratkaisu

Tallenna **`std::string`** jos omistat datan:

```cpp
class Label {
public:
    explicit Label(std::string name) : name_(std::move(name)) {}
    std::string_view name() const { return name_; }
private:
    std::string name_;
};
```

`string_view` parametrina ok — kopioi tai move stringiksi jäseneksi. CppCoreGuidelines: string_view jäsenenä vain jos elinikä taattu ulkoisesti (esim. static data).

## Käytännössä

Review: "Kuka omistaa merkkijonon?" Literaalit ok lyhyessä eliniässä. `string_view` jäsen → usein bugi tuotannossa.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-string-view)

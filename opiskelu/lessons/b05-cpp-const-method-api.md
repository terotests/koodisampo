# Getter-metodi ei muuta olion tilaa. Miten ilmaiset sen API:ssa?

## Tilanne

Luokan getter:

```cpp
class Config {
public:
    std::string host() { return host_; }
    int port() { return port_; }
private:
    std::string host_;
    int port_;
};

void print(const Config& cfg) {
    log(cfg.host());  // EI käännä — host() ei ole const
}
```

Ilman `const`-merkintää metodi voi teoriassa muuttaa jäseniä (kääntäjä ei estä). `const Config&`-parametrilla ei voi kutsua ei-const-metodeja — API on käyttökelvoton const-konteksteissa.

## Ratkaisu

Merkitse getter **`const`**:

```cpp
class Config {
public:
    const std::string& host() const { return host_; }
    int port() const { return port_; }
};
```

`const` metodi lupaa olla muuttamatta näkyvää tilaa. Kutsuja voi käyttää `const Config&`:ää luottavaisesti.

## Käytännössä

Merkitse const oletuksena kaikki metodit, jotka eivät muuta tilaa. Yhdistä `const`-viittauspaluuseen (`const std::string&` tai `string_view`). CppBestPractices Style: const-correctness alusta alkaen.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)

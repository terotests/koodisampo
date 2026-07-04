# Miten merkitset metodin joka ei muuta olion tilaa?

## Tilanne

Luokalla on getter ja kyselymetodeja:

```cpp
class Account {
public:
    std::string getName() { return name_; }
    bool isActive() { return active_; }
    void print() const;  // mutta muut ei const
};
```

Ilman `const`-merkintää kääntäjä sallii metodien muuttaa jäseniä vahingossa. `const Account&`-viittauksella ei voi kutsua ei-const-metodeja — API on epäjohdonmukainen. Refaktorointi rikkoo kutsuja, kun huomaat että getter piti olla const.

## Ratkaisu

Lisää **`const` metodin sulkevan lainausmerkin jälkeen**:

```cpp
class Account {
public:
    std::string getName() const { return name_; }
    bool isActive() const { return active_; }
    void deposit(int amount);       // muuttaa tilaa — ei const
};
```

`const`-metodi lupaa olla muuttamatta näkyviä jäseniä (mutable-poikkeus sallittu harvoin). Kääntäjä estää `name_ = ...` const-metodissa.

## Käytännössä

Merkitse const oletuksena kaikki metodit, jotka eivät muuta tilaa — "logical const". `mutable std::mutex` cache-lukolle const-metodissa. CppCoreGuidelines Con.3: "By default, mark objects and member functions const."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/06-Maintainability.md)

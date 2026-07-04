# Konstruktorit unohtavat alustaa member-kentät — satunnaiset arvot. Miten vähennät virheitä?

## Tilanne

Luokka kasvaa usealla konstruktorilla:

```cpp
class Connection {
public:
    Connection() { /* host_ jää alustamatta */ }
    Connection(std::string h) : host_(std::move(h)) {}
private:
    std::string host_;
    int port_;        // satunnainen roska
    bool connected_;  // satunnainen roska
};
```

Jokainen konstruktori pitää muistaa alustaa **kaikki** jäsenet — helppo unohtaa uusi kenttä refaktoroinnissa. Lukematon `int`/`bool` aiheuttaa satunnaista käyttäytymistä.

## Ratkaisu

**Default member initializer** luokan määrittelyssä:

```cpp
class Connection {
public:
    Connection() = default;
    Connection(std::string h) : host_(std::move(h)) {}
private:
    std::string host_;
    int port_{0};
    bool connected_{false};
};
```

Jäsenet alustuvat automaattisesti, ellei konstruktori override. Yksi paikka oletusarvoille — vähemmän copy-pastea konstruktoreissa.

## Käytännössä

C++11+ oletus: alusta jäsenet määrittelyssä. Konstruktori-alustuslista ylikirjoittaa. CppCoreGuidelines C.45: "Don't define a default constructor that only initializes data members."

[Lue lisää](https://en.cppreference.com/w/cpp/language/data_members#Member_initialization)

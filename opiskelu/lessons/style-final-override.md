# Luokka ei ole tarkoitettu perittäväksi mutta sisältää virtual-metodeja. Mitä käytät?

## Tilanne

Utility-luokka:

```cpp
class FinalRenderer {
public:
    virtual void draw() const;
    virtual ~FinalRenderer() = default;
};

class MyRenderer : FinalRenderer {  // kukaan ei tarkoittanut perintää
    void draw() const override;
};
```

Jos luokka on **suunniteltu ei-perittäväksi** (suorituskyky, invariantti, ABI), mutta virtual-metodit ovat olemassa, aliluokka voi rikkoa oletuksia — tai kääntäjä sallii ylikirjoituksen vahingossa.

## Ratkaisu

**`final`** luokalle tai metodille:

```cpp
class FinalRenderer final {
public:
    virtual void draw() const;
};

// tai yksittäinen metodi:
class Base {
public:
    virtual void draw() const;
    virtual void debug() const final;  // ei ylikirjoiteta
};
```

`final` estää perinnän tai ylikirjoituksen — compile error.

## Käytännössä

Yhdistä `override` aliluokissa, `final` kun ketju päättyy. CppCoreGuidelines C.121, C.128. Performance: devirtualization mahdollinen `final`-luokilla.

[Lue lisää](https://en.cppreference.com/w/cpp/language/final)

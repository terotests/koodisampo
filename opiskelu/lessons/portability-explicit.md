# Miksi yksiparametrisessä konstruktorissa kannattaa usein `explicit`?

## Tilanne

Tiimi kirjoittaa domain-tyypin:

```cpp
class Meters {
public:
    Meters(int value) : value_(value) {}
private:
    int value_;
};

void setDistance(Meters d);

setDistance(42);  // kääntyy — 42 muuntuu implisiittisesti Meters:ksi
```

Kutsu näyttää harmittomalta, mutta API:ssa voi syntyä hiljainen muunnos väärästä tyypistä: `double`, `size_t` tai toinen numeerinen tyyppi muuttuu `Meters`:ksi ilman että kutsuja huomaa. Refaktoroinnissa funktion signatuuri muuttuu ja kääntäjä hyväksyy yhä vanhoja kutsuja — bugi paljastuu vasta tuotannossa.

Ongelma on erityisen yleinen yksiparametrisissä konstruktoreissa, koska kääntäjä käyttää niitä **converting constructor** -sääntöjen kautta.

## Ratkaisu

Merkitse konstruktori **`explicit`**, jos implisiittinen muunnos ei ole tarkoituksellinen:

```cpp
class Meters {
public:
    explicit Meters(int value) : value_(value) {}
private:
    int value_;
};

setDistance(42);           // EI käännä
setDistance(Meters{42});   // OK — eksplisiittinen
```

`explicit` estää automaattisen muunnoksen kutsukohdassa. Se ei estä eksplisiittistä luontia sulkeilla. Poikkeus: jos tyyppi on aidosti "läpinäkyvä wrapper" ja implisiittinen muunnos on dokumentoitu osa API:ta (harvinaista), jätä `explicit` pois tietoisesti.

## Käytännössä

Käytä `explicit` oletuksena kaikille yksiparametrisille konstruktoreille, joita ei ole tarkoitettu implisiittisiksi. Sama koskee `explicit` conversion-operaattoreita C++11+:ssa. CppCoreGuidelines C.46: "By default, declare single-argument constructors explicit."

[Lue lisää](https://en.cppreference.com/w/cpp/language/explicit)

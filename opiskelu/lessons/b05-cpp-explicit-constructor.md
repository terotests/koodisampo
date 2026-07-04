# Luokka `Meters(int v)` aiheuttaa vahingossa implisiittisiä muunnoksia. Miten estät?

## Tilanne

Vahva tyyppi metrielle:

```cpp
class Meters {
public:
    Meters(int v) : value_(v) {}
};

void setDistance(Meters m);

setDistance(42);        // OK — implisiittinen muunnos
Meters m = 3.5;         // Yllätys? int(3.5) → 3
```

Yksiparametriset konstruktorit toimivat **muunnoskonstruktoreina** ellei toisin määrätä. Tämä on bugilähde mittayksiköissä, tunnisteissa ja "vahvoissa typedefeissä".

## Ratkaisu

```cpp
class Meters {
public:
    explicit Meters(int v) : value_(v) {}
};

setDistance(42);           // virhe — pitää Meters{42}
setDistance(Meters{42});   // OK
```

`explicit` estää hiljaiset muunnokset kutsukohdassa. Kopiointi ja move eivät muutu.

## Milloin explicit

Yksiparametriset konstruktorit: oletus `explicit`, ellei luonteva muunnos ole tarkoituksellinen (esim. `std::string` literaalista).

[Lue lisää](https://en.cppreference.com/w/cpp/language/explicit)

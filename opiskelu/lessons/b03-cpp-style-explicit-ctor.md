# Luokka `Meters(int v)` aiheuttaa vahingossa `double d = 3.5; Meters m = d;`. Miten estät?

## Tilanne

Domain-tyyppi metrille:

```cpp
class Meters {
public:
    Meters(int v) : v_(v) {}
private:
    int v_;
};

double distance = 3.5;
Meters m = distance;  // implisiittinen muunnos double → int → Meters
```

Kääntäjä hyväksyy ketjun: `double` truncataan `int`:iksi ja konstruoidaan `Meters` implisiittisesti. Fyysinen tarkkuus katoaa — 3.5 metriä muuttuu 3 metriksi ilman varoitusta. API:n tarkoitus (yksikkötyyppi turvallisuus) pettää.

## Ratkaisu

**`explicit Meters(int v)`**:

```cpp
class Meters {
public:
    explicit Meters(int v) : v_(v) {}
private:
    int v_;
};

Meters m{static_cast<int>(distance)};  // tietoinen truncaus näkyvissä
// Meters m = distance;  // EI käännä
```

`explicit` estää implisiittisen muunnosketjun kutsukohdassa. Jos tarvitset `double`-metrejä, lisää erillinen `explicit Meters(double)` tai factory, joka dokumentoi pyöristyksen.

## Käytännössä

Yksiparametriset konstruktorit `explicit` oletuksena domain-tyypeille (Meters, UserId, Port). CppCoreGuidelines C.46. Review: "Miksi implisiittinen muunnos on sallittu?"

[Lue lisää](https://en.cppreference.com/w/cpp/language/explicit)

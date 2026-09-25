# Aliluokka ylikirjoittaa `virtual void draw()` mutta perusluokan signatuuri muuttuu hiljaisesti — kääntäjä ei varoita. Mitä lisäät aliluokan metodiin?

## Tilanne

Perusluokka päivitetään:

```cpp
class Base {
public:
    virtual void draw(int flags = 0);
};

class Derived : public Base {
public:
    virtual void draw();  // piilottaa Base::draw — ei override!
};
```

Koodi kääntyy. `Derived`-olio kutsutaan `Base*`:n kautta — väärä metodi, hiljainen bugi. Parametrilistan ero riittää rikkomaan override-yhteyden — oletusarvo ei tee `draw(int)`:stä ja `draw()`:stä samaa signatuuria.

## Ratkaisu

Käytä `override`-avainsanaa:

```cpp
void draw() override;  // kääntäjävirhe jos ei matchaa basea
```

Kääntäjä varmistaa, että signatuuri vastaa virtuaalista base-metodia. Yhdistä `final` jos luokkaa ei ole tarkoitettu perittäväksi.

## Käytännössä

Kieli ei vaadi `override`a, mutta se on vahvasti suositeltu käytäntö periytyvässä koodissa (CppCoreGuidelines C.128). Se korvaa manuaalisen "onko tämä oikeasti virtual override" -tarkistuksen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/override)

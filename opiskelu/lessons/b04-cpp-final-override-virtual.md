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

Koodi kääntyy. `Derived`-olio kutsutaan `Base*`:n kautta — väärä metodi, hiljainen bugi. Parametrilistan ero (oletusarvo lasketaan) riittää rikkomaan override-yhteyden.

## Ratkaisu

Käytä `override`-avainsanaa:

```cpp
void draw() override;  // kääntäjävirhe jos ei matchaa basea
```

Kääntäjä varmistaa, että signatuuri vastaa virtuaalista base-metodia. Yhdistä `final` jos luokkaa ei ole tarkoitettu perittäväksi.

## Käytännössä

`override` on pakollinen käytäntö periytyvässä koodissa. Se korvaa manuaalisen "onko tämä oikeasti virtual override" -tarkistuksen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/override)

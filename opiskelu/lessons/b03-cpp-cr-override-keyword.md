# Johdettu luokka ylikirjoittaa `virtual void draw()` mutta kirjoittaa `void draw()` ilman overridea. Riski?

## Tilanne

Renderöintihierarkiassa:

```cpp
struct Base {
    virtual void draw() const;
};

struct Icon : Base {
    void draw() const;  // tarkoitus override — mutta ei override-avainsanaa
};
```

Jos base muuttuu (`draw()` → `draw(RenderContext&)`), `Icon::draw() const` **ei enää override** — se piilottaa vanhan metodin. Kääntäjä ei varoita, koska ilman `override`:a uusi metodi on laillinen. Polymorfiset kutsut `Base*`:n kautta käyttävät base-versiota — ikoni piirtyy väärin.

Signatuurin pieni ero (`const` puuttuu, parametri lisätty) on yleisin syy tällaisiin bugeihin.

## Ratkaisu

Lisää **`override`** — kääntäjä varmistaa base-signatuurin:

```cpp
struct Icon : Base {
    void draw() const override;
};
```

Jos base-signatuuri ei täsmää → **compile error** heti refaktoroinnissa, ei tuotantobugi kuukausia myöhemmin.

## Käytännössä

Code review: "Lisää override kaikkiin virtual-ylikirjoituksiin." `-Wsuggest-override` (GCC) auttaa. CppCoreGuidelines C.128. Yhdistä `final` kun perintäketju ei jatku.

[Lue lisää](https://en.cppreference.com/w/cpp/language/override)

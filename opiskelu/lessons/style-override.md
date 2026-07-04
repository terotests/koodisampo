# Miksi käyttää `override` periytyvässä metodissa?

## Tilanne

Periytymisessä on helppo tehdä kirjoitusvirhe:

```cpp
struct Base {
    virtual void draw() const;
};

struct Derived : Base {
    void draw() const;  // tarkoitus: override — mutta jos base muuttuu?
};

struct Broken : Base {
    void Draw() const;  // iso D — EI override, uusi metodi!
};
```

Jos perusluokan signatuuri muuttuu (`draw()` → `draw(bool)`) ja johdettu luokka ei päivity, vanha `draw()` **piilottaa** tarkoituksen — ei virtual-kutsua, ei kääntäjävaroitusta. Tuotannossa polymorfia "ei toimi" ja debuggaus vie tunteja.

## Ratkaisu

Merkitse ylikirjoitus **`override`**:

```cpp
struct Derived : Base {
    void draw() const override;
};

struct Broken : Base {
    void Draw() const override;  // KÄÄNTÄJÄVIRHE — ei vastaa base:a
};
```

`override` pakottaa kääntäjän tarkistamaan, että base-luokassa on täsmälleen sama virtual-metodi. Signatuurivirhe = compile error, ei hiljaista piilottamista.

## Käytännössä

Käytä `override` aina kun tarkoitus on ylikirjoittaa virtual-metodi. Yhdistä `final`, jos aliluokat eivät saa enää ylikirjoittaa. CppCoreGuidelines C.128: "Use override to make overriding explicit."

[Lue lisää](https://en.cppreference.com/w/cpp/language/override)

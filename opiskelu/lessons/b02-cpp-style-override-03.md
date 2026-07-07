# Mikä merkintä pakottaa kääntäjän varmistamaan, että aliluokan metodi todella ylikirjoittaa base-metodin?

## Tilanne

Periytymishierarkia piirtämisessä:

```cpp
struct Shape {
    virtual void draw() const;
};

struct Circle : Shape {
    void Draw() const;  // iso D — UUSI metodi, ei override!
};
```

Kehittäjä luulee ylikirjoittaneensa `draw()`, mutta nimi eroaa yhdellä kirjaimella. Kääntäjä hyväksyy koodin — ei virtual-kutsua `Circle`:lle `Shape*`:n kautta. Bugi näkyy vasta renderöinnissä: ympyrä piirtyy oletusmuotona. Refaktoroinnissa base-signatuuri muuttuu ja johdettu luokka jää vanhaan versioon hiljaa.

## Ratkaisu

Lisää **`override`** johdettuun metodiin:

```cpp
struct Circle : Shape {
    void draw() const override;  // OK — täsmää base:a
    // void Draw() const override;  // KÄÄNTÄJÄVIRHE
};
```

`override` pakottaa kääntäjän varmistamaan, että base-luokassa on täsmälleen sama virtual-metodi. Kirjoitusvirhe signatuurissa = compile error heti, ei tuotantobugia.

## Käytännössä

Code review -checklist: jokainen `virtual` periytymä → `override` aliluokassa. CppCoreGuidelines C.128. Yhdistä `final`, jos ketju päättyy. IDE highlightaa override-metodit — hyödynnä reviewissa.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#c-override)

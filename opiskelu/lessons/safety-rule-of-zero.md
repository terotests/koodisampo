# Mitä Rule of Zero tarkoittaa?

## Tilanne

Tiimi kirjoittaa luokan:

```cpp
class Team {
    std::vector<Member> members_;
    std::string name_;
    std::unique_ptr<Database> db_;
};
```

Joku ehdottaa copy-konstruktorin, destructorin ja move-operaattorien kirjoittamista "varmuuden vuoksi". Käsin kirjoitetut special member -funktiot helposti unohtavat self-assignmentin, poikkeusturvan tai `noexcept`:n — ja **duplikoivat** sen, mitä jäsenet (`vector`, `string`, `unique_ptr`) jo tekevät oikein.

## Ratkaisu

**Rule of Zero:** jos luokan jäsenet hoitavat resurssit (RAII), **älä määrittele** destructoria, copy/move-operaatioita — kääntäjä generoi oikeat oletukset:

```cpp
class Team {
public:
    Team() = default;
    // ei destructoria, ei copy/move — jäsenet hoitavat
private:
    std::vector<Member> members_;
    std::string name_;
    std::unique_ptr<Database> db_;
};
```

`unique_ptr` poistaa kopioinnin (move only). `vector` ja `string` kopioituvat/moovautuvat oikein. Vain jos hallitset **raakaa resurssia** (raw pointer, FILE*, mutex), tarvitset Rule of Five -määrittelyt tai wrapper-tyypin.

## Käytännössä

Prefer Rule of Zero uudessa koodissa. Jos copy pitää estää: `= delete`. Jos raw resurssi: `unique_ptr` tai Rule of Five huolellisesti. CppCoreGuidelines C.21, C.22.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-zero)

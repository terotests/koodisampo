# Miksi cpp-best-practices suosittelee välttämään `T[N]`-taulukoita rajapinnoissa?

## Tilanne

Rajapinta näyttää tutulta C-koodista:

```cpp
void parse(const char* buf, size_t len);
void process(int data[256]);  // decay → osoitin, 256 katoaa!

parse(userInput, userInputLen);  // caller vastaa rajasta
process(stackBuf);               // kutsuja olettaa 256 — API ei tiedä
```

C-taulukko funktioparametrina **decay**t osoittimeksi — koko ei kulje tyypin mukana. Kääntäjä ei voi tarkistaa yli- tai alirajaa. `process(otherBuf)` kääntyy, vaikka puskuri olisi 64 tavua. Buffer overrun on yksi yleisimmistä turvallisuusaukoista.

## Ratkaisu

Käytä tyyppejä, joissa **koko on osa API:ta**:

```cpp
void process(std::array<int, 256>& data);
void parse(std::span<const std::byte> buf);

// dynaaminen koko:
void handle(std::vector<int>& data);
void read(std::span<int> buffer);  // koko aina mukana
```

`std::array` kiinteälle koolle, `span` näkymälle ulkoiseen muistiin, `vector` omistetulle dynaamiselle datalle. Kutsuja ja implementaatio jakavat saman pituustiedon — rajat ovat tarkistettavissa (`at()`, `span::size()`).

## Käytännössä

CppBestPractices Considering Safety: älä käytä `T[]` tai `T*` + erillistä pituutta uudessa koodissa. Legacy-API:t kääri `span`:iin sisäisesti. `-Warray-bounds` ja sanitizers auttavat löytämään jäljellä olevat C-rajapinnat.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md)

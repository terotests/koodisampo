# Silmukka liittää tuhansia rivejä `std::string`iin — profiloija näyttää toistuvia realokointeja. Ensimmäinen korjaus?

## Tilanne

CSV-raportti rakennetaan silmukassa:

```cpp
std::string result;
for (const auto& row : rows) {
    result += formatRow(row);  // uusi merkkijono joka kierroksella
    result += '\n';
}
```

Jokainen `+=` voi kasvattaa kapasiteettia uudelleenallokoimalla — O(n²) kopioita suurilla syötteillä. Profiloija näyttää toistuvia `malloc`/`realloc` kutsuja ja `memcpy`:jä. Muistipiikki kasvaa turhaan.

Ennen algoritmin vaihtoa ensimmäinen vipu on **varata tilaa etukäteen**, jos lopullinen koko on arvioitavissa.

## Ratkaisu

**`result.reserve(estimatedSize)`** ennen silmukkaa:

```cpp
std::string result;
result.reserve(rows.size() * avgRowBytes);

for (const auto& row : rows) {
    result += formatRow(row);
    result += '\n';
}
```

`reserve` ei muuta merkkijonon pituutta — se varaa kapasiteetin ilman uudelleenallokaatiota kasvun aikana (kunnes ylität varauksen). Arvio: `rivimäärä × keskimääräinen rivipituus`.

## Käytännössä

CppBestPractices Performance: `reserve` vectorille ja stringille kun koko tiedossa tai arvioitavissa. Vaihtoehto: `ostringstream` + reserve, tai `std::format` suoraan bufferiin. Mittaa ennen/jälkeen — reserve on halpa kokeilla.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/06-Performance.md)

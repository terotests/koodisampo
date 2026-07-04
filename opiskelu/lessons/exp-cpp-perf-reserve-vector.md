# Profileri näyttää tuhansia vector-uudelleenallokaatioita CSV-parserissa. Ensimmäinen optimointi?

## Tilanne

CSV-parseri kasvattaa vektoria rivi riviltä:

```cpp
std::vector<std::string> rows;
while (readLine(line)) {
    rows.push_back(parse(line));
}
```

Profiloija: 90 % ajasta `vector` reallokoinneissa. Parserin logiikka on nopea — kontti hidastaa. Tuotannossa suuret tiedostot aiheuttavat turhia muistipiikkejä.

Ennen algoritmien vaihtoa ensimmäinen askel on **varata kapasiteetti**, jos rivimäärä on arvioitavissa tai luettavissa etukäteen.

## Ratkaisu

**`rows.reserve(estimatedSize)`** ennen silmukkaa:

```cpp
std::vector<std::string> rows;
rows.reserve(countLines(path));  // tai fileSize / avgLineBytes
while (readLine(line)) {
    rows.push_back(parse(line));
}
```

Yksi tai muutama allokaatio vs tuhansia. Jos tarkka koko ei tiedossa, karkea arvio (file size / 80) riittää usein.

## Käytännössä

Mittaa `reserve`:n jälkeen — usein 2–10× nopeutus suurilla syötteillä. `shrink_to_fit` vain jos muisti kriittinen jälkikäteen. CppBestPractices Performance.

[Lue lisää](https://en.cppreference.com/w/cpp/container/vector/reserve)

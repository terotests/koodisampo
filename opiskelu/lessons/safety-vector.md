# Mikä on moderni korvike dynaamiselle `int[]`-taulukolle?

## Tilanne

Legacy-koodi tai C-tausta johtaa tällaiseen malliin:

```cpp
void process(int count) {
    int* data = new int[count];
    // ...
    delete[] data;  // poikkeus → leak
}
```

Koko ei kulje tyypin mukana — `process(data, wrong_count)` on helppo. `delete[]` vs `delete` -virhe on UB. Rajatarkistukset puuttuvat. Tämä on yksi yleisimmistä C++-turvallisuusaukoista.

## Ratkaisu

**`std::vector<int>`** hoitaa allokaation, koon ja tuhoamisen:

```cpp
void process(int count) {
    std::vector<int> data(count);  // tai reserve + push_back
    // data.size() aina saatavilla
}
```

`vector` on exception-safe: poikkeus kesken funktion vapauttaa muistin automaattisesti. Rajattu pääsy: `data.at(i)` heittää `out_of_range`, `data[i]` debug-buildissa voi tarkistaa.

Kiinteän koon tarvitessa: **`std::array<int, N>`** stackilla — ei dynaamista allokaatiota, koko osa tyyppiä.

## Käytännössä

CppBestPractices Considering Safety: vältä `T[N]` ja `new[]` rajapinnoissa. Käytä `std::span<const int>` jos funktio vain lukee ulkoista bufferia. Profiloinnissa `vector` + `reserve(n)` kun koko tiedossa etukäteen.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md)

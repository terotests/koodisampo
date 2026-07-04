# Code review kommentoi `for (int i = 0; i < n; i++)` iterator-tyypin sijaan. Miksi pre-increment?

## Tilanne

Silmukka käyttää indeksiä:

```cpp
for (int i = 0; i < n; ++i) {
    process(data[i]);
}
```

Review-kommentti koskee usein iterator-silmukoita:

```cpp
for (auto it = v.begin(); it != v.end(); it++) {  // post-increment
    use(*it);
}
```

Post-increment (`it++`) luo **väliaikaisen kopion** iteratorista ennen kasvatusta. Pre-increment (`++it`) kasvattaa suoraan — halvempi monimutkaisille iteratoreille (esim. `std::list`).

## Ratkaisu

Käytä **`++i`** / **`++it`** (pre-increment):

```cpp
for (auto it = v.begin(); it != v.end(); ++it) {
    use(*it);
}
```

Int-silmukassa ero on mitätön — tyyli ja semantiikka ("kasvata ensin") ovat silti oikein. Prefer **range-for**, jolloin increment-tyyli ei ole relevantti.

## Käytännössä

CppBestPractices Style: pre-increment oletuksena. Range-for eliminoi iterator-increment-keskustelun. Profiloi vain jos hot loop todella käyttää raskaita iteratoreita.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)

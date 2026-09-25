# Code review kommentoi silmukkaa `for (auto it = c.begin(); it != c.end(); it++)`. Miksi cpp-best-practices suosii `++it`:tä?

## Tilanne

Review-kommentti koskee iterator-silmukkaa:

```cpp
for (auto it = v.begin(); it != v.end(); it++) {  // post-increment
    use(*it);
}
```

Post-increment (`it++`) palauttaa **väliaikaisen kopion** iteratorin vanhasta arvosta, vaikka sitä ei käytetä. Pre-increment (`++it`) kasvattaa suoraan — ero on todellinen raskaille tai käyttäjän määrittelemille iteraattoreille, joita kääntäjä ei välttämättä optimoi.

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

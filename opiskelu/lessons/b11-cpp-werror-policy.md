# Tiimi haluaa ettei uusia varoituksia päädy main-haaraan. Mikä käytäntö vastaa cpp-best-practices -suositusta?

## Tilanne

Varoitukset kertyvät — "korjataan myöhemmin". Uusi varoitus hukkuu meluun. Regressio: entiset warningit takaisin.

## Ratkaisu

**`-Werror`** (GCC/Clang) / **`/WX`** (MSVC) CI:ssä:

```cmake
add_compile_options(-Wall -Wextra -Werror)
```

Uusi varoitus = build fail. Korjaa heti tai suppress tietoisesti dokumentoidulla `#pragma`.

## Käytännössä

Aloita `-Wall -Wextra` ilman Werror, sitten Werror kun puhdas. CppBestPractices: warnings as errors in CI.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/02-Use_the_Tools_Available.md)

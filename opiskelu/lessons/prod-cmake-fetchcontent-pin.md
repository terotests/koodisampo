# FetchContent hakee fmt-kirjaston GitHubin `main`-branchista. CI-buildit alkavat epäonnistua satunnaisesti ilman koodimuutoksia. Mikä korjaus?

## Tilanne

```cmake
FetchContent_Declare(fmt
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG main
)
FetchContent_MakeAvailable(fmt)
```

`main` liikkuu. Upstream merge voi rikkoa API:n, vaihtaa CMake-vaatimuksia tai tuoda uuden warningin. CI epäonnistuu vaikka oma commit on tyhjä — "works on my machine" eilen, ei tänään.

## Ratkaisu

Pinnaa **release-tag** tai **commit SHA**:

```cmake
FetchContent_Declare(fmt
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG 11.0.2   # tai täysi commit hash
)
FetchContent_MakeAvailable(fmt)
```

Päivitä riippuvuus tietoisesti erillisessä PR:ssä, jossa ajat testit.

## Käytännössä

- `GIT_SHALLOW TRUE` nopeuttaa clonea tagilla; se ei korvaa pinnausta.
- Vaihtoehto: järjestelmän paketti / vcpkg manifest version lock.
- Dokumentoi riippuvuuden päivitysprosessi — älä seuraa liikkuvaa branchia tuotanto-CI:ssä.

[Lue lisää](https://cmake.org/cmake/help/latest/module/FetchContent.html)

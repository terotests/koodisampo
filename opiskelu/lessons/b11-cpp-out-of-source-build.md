# CMake generoi object-tiedostot samaan hakemistoon kuin lähdekoodi. Miten cpp-best-practices suosittelee?

## Tilanne

Build suoraan lähdehakemistossa:

```bash
cd src/
cmake .
make   # .o, CMakeCache, generated files sekaisin lähdekoodin kanssa
```

Lähdehakemisto likaantuu — `git status` täynnä build-artefakteja. Puhdas checkout vaikeutuu. Eri konfiguraatiot (debug/release) sekoittuvat.

## Ratkaisu

**Out-of-source build** — erillinen `build/` hakemisto:

```bash
mkdir build && cd build
cmake ..
cmake --build .
```

Lähdekoodi pysyy puhtaana. Useita build-kansioita: `build-debug`, `build-release`. `.gitignore`: `build/`.

## Käytännössä

CppBestPractices / CMake: aina erillinen build dir. CI: `cmake -B build -S .`. Poista in-source build `-DCMAKE_DISABLE_SOURCE_CHANGES=ON`.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/02-Use_the_Tools_Available.md)

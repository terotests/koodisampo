# clang-tidy ei löydä oikeita include-polkuja CMake-projektissa. Mitä build-vaiheessa tarvitaan?

## Tilanne

```bash
clang-tidy foo.cpp
# error: 'MyHeader.hpp' file not found
```

clang-tidy ei tiedä `-I`-polkuja, `-D`-defineja, C++-standardia — ellei saa **compile database**a.

## Ratkaisu

**`CMAKE_EXPORT_COMPILE_COMMANDS=ON`**:

```bash
cmake -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
ln -sf build/compile_commands.json .
clang-tidy -p . src/foo.cpp
```

`compile_commands.json` listaa jokaisen `.cpp`:n täyden kääntäjäkomennon. LLM/IDE/clang-tidy käyttää samaa.

## Käytännössä

Commit symlink tai dokumentoi `ln -sf`. CI: generoi compile_commands ennen tidy-ajoa. Bear/make wrapper vaihtoehto non-CMake-projekteille.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/02-Use_the_Tools_Available.md)

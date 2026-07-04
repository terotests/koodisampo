# PR:ssä jokainen header vetää mukaan `<iostream>` vaikka käytetään vain `std::vector`. Miten automatisoidaan siivous?

## Tilanne

Transitive includes — `<iostream>` 2 MB compile time per TU. Turhat includet hidastavat buildia.

## Ratkaisu

**Include-what-you-use (IWYU)**:

```bash
include-what-you-use -Xiwyu --transitive_includes foo.cpp
```

Ehdottaa poistettavia ja puuttuvia headereita. Forward declare kun mahdollista.

## Käytännössä

IWYU CI-varoituksina. Yhdistä forward declarations. CppCoreGuidelines SF.11. PCH ei korvaa IWYU:ta.

[Lue lisää](https://github.com/include-what-you-use/include-what-you-use)

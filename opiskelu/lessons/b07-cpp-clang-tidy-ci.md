# Code reviewissa samat CppCoreGuidelines-rikkomukset toistuvat. Miten automatisoida?

## Tilanne

Toistuvat review-kommentit: raw pointer, missing override, wrong include order. Manuaalinen review ei skaalaudu — sama virhe eri kehittäjiltä.

## Ratkaisu

**clang-tidy** CI-build-vaiheessa:

```bash
run-clang-tidy -p build -checks='cppcoreguidelines-*,modernize-*'
```

Fail PR jos uusia rikkomuksia. Aja paikallisesti ennen pushia.

## Käytännössä

`.clang-tidy` repossa, laajenna asteittain. Yhdistä `-Werror` valittuihin varoituksiin. CppBestPractices: automate guidelines.

[Lue lisää](https://clang.llvm.org/extra/clang-tidy/checks/list.html)

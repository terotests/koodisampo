# Code review täyttyy väittelyistä sijoittelusta ja rivipituudesta. Miten automatisoida?

## Tilanne

Pull requestissa 30 kommenttia:

- "Laita aaltosulut tähän"
- "Rivi yli 100 merkkiä"
- "Välilyönnit vs tabit"

Aika menee tyylistä, ei logiikasta. Eri kehittäjien IDE:t formatoi eri tavalla — diff täynnä whitespace-muutoksia.

## Ratkaisu

**`.clang-format`** + automaattinen formatointi:

```yaml
# .clang-format (esimerkki)
BasedOnStyle: LLVM
IndentWidth: 4
ColumnLimit: 100
```

CI tai pre-commit ajaa `clang-format -i`. Kaikki noudattavat samaa tiedostoa — review keskittyy sisältöön.

## Käytännössä

Commit `.clang-format` repoon. `git clang-format` ennen pushia. Editor-integraatio (format on save). CppBestPractices: yksi jaettu tyyli koko tiimille.

[Lue lisää](https://clang.llvm.org/docs/ClangFormat.html)

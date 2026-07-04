# CI-putki kaatuu yöllä AddressSanitizer-virheeseen, mutta paikallinen release-build menee läpi. Mitä ehdotat ensimmäiseksi?

## Tilanne

PR merge → yö-CI ASan fail → kehittäjä: "toimi minulla". Release-build ei havaitse use-after-free, leak, overflow.

## Ratkaisu

**Reprodukoi paikallisesti samalla buildilla**:

```bash
cmake -DCMAKE_CXX_FLAGS="-fsanitize=address -g"
ctest
```

Sama sanitizer + debug symbols kuin CI. Korjaa ennen mergeä — älä disable CI-check.

## Käytännössä

Dokumentoi sanitizer-build README:ssa. CI ja local parity. CppCoreGuidelines Pro-type: use sanitizers in CI.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Pro-type)

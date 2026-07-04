# Tuotantoon pääsee signed overflow -bugi vain tietyllä ARM-buildilla. CI-parannus?

## Tilanne

```cpp
int a = INT_MAX;
int b = a + 1;  // signed overflow — UB
```

Release-build ilman sanitizeria — bugi näkyy harvoin x86:lla, useammin ARM-testeissä. Tuotantoon pääsee ennen kuin repro löytyy.

## Ratkaisu

**UBSan** CI/debug-buildissä:

```bash
CXXFLAGS="-fsanitize=undefined -fno-sanitize-recover=undefined -g"
```

Yhdistä **ASan** muistivirheisiin. Aja test suite sanitizer-buildilla jokaisessa PR:ssä.

## Käytännössä

Erillinen sanitizer-konfiguraatio — ei tuotantobinary. `-fsanitize=signed-integer-overflow`. CppCoreGuidelines: CI catches UB.

[Lue lisää](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)

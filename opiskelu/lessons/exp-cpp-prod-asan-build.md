# Muistivuoto epäilty tuotannossa. Mitä CI-buildia pyydät ensin ennen tuotantokokeilua?

## Tilanne

Palvelu muistinkäyttö kasvaa viikkojen aikana. Valgrind hidas, tuotantoon vaikea. Epäily: use-after-free, buffer overflow, leak — mutta repro on vaikea.

## Ratkaisu

**AddressSanitizer (ASan)** debug/CI-buildissä:

```bash
cmake -DCMAKE_CXX_FLAGS="-fsanitize=address -g -O1"
./run_tests
```

ASan havaitsee heap/stack buffer overflow, use-after-free, leaks testeissä — nopea feedback. Yhdistä **UBSan** (`-fsanitize=undefined`) signed overflow -bughin.

## Käytännössä

CI-askel ennen mergeä: ASan + test suite. Erillinen ASan-build — ei tuotantobinary. TSan säiebughin. CppBestPractices Safety.

[Lue lisää](https://github.com/google/sanitizers/wiki/AddressSanitizer)

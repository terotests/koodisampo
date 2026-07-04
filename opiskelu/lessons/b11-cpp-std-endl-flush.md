# Hot loopissa logataan tuhansia rivejä `std::cout << x << std::endl`. Miksi hidasta?

## Tilanne

Debug-logitus silmukassa:

```cpp
for (const auto& row : rows) {
    std::cout << row.id << " " << row.value << std::endl;
}
```

**`std::endl`** tekee kaksi asiaa: lisää newline **ja flushaa** puskurin joka kerta. Flush on syscall — hidas verrattuna pelkkään merkkien kirjoitukseen puskuriin. Tuhansilla riveillä suorituskyky romahtaa.

## Ratkaisu

Käytä **`'\n'`** ilman flushia:

```cpp
std::cout << row.id << " " << row.value << '\n';
```

Flush vain kun tarvitaan (`std::flush` tai `endl` harvoin). Tuotannossa: async-logitus, batch-write, tai poista logitus hot loopista kokonaan.

## Käytännössä

CppBestPractices Performance: älä `endl` silmukoissa. `std::cerr` flushaa usein automaattisesti — eri kuin cout. Review: "Korvaa endl → \\n hot pathissa."

[Lue lisää](https://en.cppreference.com/w/cpp/io/manip/endl)

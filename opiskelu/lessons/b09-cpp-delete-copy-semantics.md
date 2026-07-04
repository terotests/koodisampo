# Luokka hallitsee yksilöllistä resurssia — kopio ei saa olla mahdollinen. Miten ilmaiset API:ssa?

── Väärin vastatut (22) ──


**Ratkaisu:** poista kopiointi `= delete`:

```cpp
class FileHandle {
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
};
```

Kääntäjä estää kaksois-sulun / dangling-resurssin heti. Rule of Five — päätä tietoisesti kaikki viisi operaatiota.

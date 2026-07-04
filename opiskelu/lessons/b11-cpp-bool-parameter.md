# API: `void save(File& f, bool fast);` — kutsuissa `save(f, true)` ei kerro mitä true tarkoittaa. Parempi API?

## Tilanne

```cpp
void save(File& f, bool fast);
save(f, true);   // true = fast? compress? async?
save(f, false);
```

Bool-parametri on **opaque** — kutsukohdassa intentio ei näy. Refaktoroinnissa parametrien järjestys muuttuu hiljaa väärin. Code review: "Mitä true tarkoittaa?"

## Ratkaisu

**`enum class`** tai erilliset funktiot:

```cpp
enum class SaveMode { Fast, Thorough };
void save(File& f, SaveMode mode);
save(f, SaveMode::Fast);

// tai:
void saveFast(File& f);
void saveThorough(File& f);
```

Intentio näkyy kutsukohdassa. Enum estää vahingossa väärän bool-arvon.

## Käytännössä

CppBestPractices Style: vältä bool-parametreja useassa merkityksessä. Poikkeus: aidosti kaksitilainen flag (`enabled`). Review: "Nimeä parametri tai käytä enum class."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)

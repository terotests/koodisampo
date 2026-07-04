# Luokka ei saa kopioida — kopio-konstruktori kutsuu vahingossa. Miten estät käännösaikana?

## Tilanne

```cpp
class FileHandle {
    int fd_;
public:
    FileHandle(int fd) : fd_(fd) {}
    // kopio syntyy automaattisesti — kaksi handlea sulkee saman fd:n!
};

FileHandle a(3);
FileHandle b = a;  // BUG — double close
```

Oletus copy-operaattori kopioi `fd_`:n — kaksi objektia, yksi kernel handle.

## Ratkaisu

**`= delete`** copy-operaatioille:

```cpp
class FileHandle {
public:
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
    FileHandle(FileHandle&&) = default;
    FileHandle& operator=(FileHandle&&) = default;
};
```

Kutsu → **compile error**. Intentio näkyy API:ssa. Rule of Five — päätä tietoisesti kaikki viisi.

## Käytännössä

CppCoreGuidelines C.21, C.67. `= default` move kun unique ownership. Review: "Delete copy — unique resource."

[Lue lisää](https://en.cppreference.com/w/cpp/language/function#Deleted_functions)

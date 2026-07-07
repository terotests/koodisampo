# Luokka hallitsee tiedostonkuvaajaa eikä saa kopioida eikä siirtää. Mikä C++11-merkintä kieltää copy-operaation selkeästi kääntäjälle?

## Tilanne

```cpp
class LogFile {
    FILE* f_;
public:
    LogFile(const char* path);
    ~LogFile() { fclose(f_); }
    // default copy → kaksi fclose samaan FILE*
};
```

Copy syntyy automaattisesti ellei poisteta — unique resource vaatii eksplisiittisen päätöksen.

## Ratkaisu

**`= delete`** copy, **`= default`** tai move move-only resurssille:

```cpp
LogFile(const LogFile&) = delete;
LogFile& operator=(const LogFile&) = delete;
LogFile(LogFile&&) = default;
LogFile& operator=(LogFile&&) = default;
```

Intentio näkyy kääntäjälle — kutsu on compile error.

## Käytännössä

CppCoreGuidelines C.21. Prefer `unique_ptr`/RAII wrapper. Review: "Delete copy — single owner."

[Lue lisää](https://en.cppreference.com/w/cpp/language/function#Deleted_functions)

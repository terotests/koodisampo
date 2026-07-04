# Luokassa on custom destructor mutta ei copy/move -operaatioita. Code review -huomio?

## Tilanne

```cpp
class Handle {
    int fd_;
public:
    ~Handle() { close(fd_); }
    // copy/move — compiler generated shallow copy!
};
```

Custom destructor → tarkista **Rule of Five**. Default copy kopioi fd — double close.

## Ratkaisu

Määrittele tai **`= delete`/`= default` kaikki viisi**:

```cpp
Handle(const Handle&) = delete;
Handle& operator=(const Handle&) = delete;
Handle(Handle&&) = default;
Handle& operator=(Handle&&) = default;
```

Tai Rule of Zero wrapper-tyypillä.

## Käytännössä

Review checklist: destructor → copy/move. CppCoreGuidelines C.21, C.22.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-five)

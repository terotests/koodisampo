# Code reviewissa toistuu sama raw-pointer-anti-pattern. Miten automatisoida?

## Tilanne

Jokaisessa PR:ssä sama kommentti:

- "Käytä unique_ptr"
- "Raw new/delete"
- "C-style cast"

Manuaalinen review ei skaalaudu — vanha koodi toistaa samoja virheitä, uudet kehittäjät kopioivat anti-patterneja.

## Ratkaisu

**clang-tidy** CI:ssä:

```yaml
# .clang-tidy
Checks: >
  modernize-raw-allocations,
  modernize-use-nullptr,
  bugprone-*,
  cppcoreguidelines-*
```

```bash
clang-tidy src/*.cpp -- -std=c++20
```

Fail build uusista rikkomuksista. Kehittäjä korjaa ennen mergeä.

## Käytännössä

Aloita pienellä check-joukolla, laajenna asteittain. `compile_commands.json` vaaditaan (CMake: `CMAKE_EXPORT_COMPILE_COMMANDS=ON`). CppBestPractices: automate what you repeat in review.

[Lue lisää](https://clang.llvm.org/extra/clang-tidy/)

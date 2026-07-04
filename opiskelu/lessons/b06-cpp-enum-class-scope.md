# Code reviewissa `enum Color { Red, Green };` aiheuttaa nimikonfliktit headerissa. Miten korjaat modernisti?

## Tilanne

Kaksi headeria:

```cpp
// colors.h
enum Color { Red, Green, Blue };

// status.h  
enum Status { OK, Red, FAIL };  // Red törmää!
```

Unscoped `enum` vuotaa enumerattorit globaaliin namespaceen. `Red` on sekä väri että status — kääntäjävirhe tai väärä tulkinta. Implisiittinen int-muunnos sekoittaa tyypit.

## Ratkaisu

**`enum class Color { Red, Green, Blue };`**:

```cpp
enum class Color { Red, Green, Blue };
enum class Status { OK, Fail };

Color c = Color::Red;
// int i = Color::Red;  // EI käännä
```

Scoped enum eristaa nimet ja estää implisiittiset muunnokset.

## Käytännössä

Refaktoroi moduuli kerrallaan. C-API-yhteensopivuus: yksi rajattu `static_cast<int>(Color::Red)` export-funktiossa. CppCoreGuidelines Enum.3: prefer `enum class`.

[Lue lisää](https://en.cppreference.com/w/cpp/language/enum)

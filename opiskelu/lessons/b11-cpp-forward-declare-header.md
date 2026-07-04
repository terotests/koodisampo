# Headeriin lisätään `#include "HeavyWidget.hpp"` vain koska funktio ottaa `HeavyWidget&`. Miten keventää?

## Tilanne

```cpp
// Service.hpp
#include "HeavyWidget.hpp"  // vetää 50 headeria mukaan
class Service {
    void process(HeavyWidget& w);
};
```

Jokainen `Service.hpp` includer kääntää `HeavyWidget`:in — build hidastuu.

## Ratkaisu

**Forward declaration** headerissa:

```cpp
// Service.hpp
class HeavyWidget;
class Service {
    void process(HeavyWidget& w);
};
// Service.cpp
#include "HeavyWidget.hpp"
```

Include vain `.cpp`:ssä, jossa tyyppi tarvitaan täydellisesti.

## Käytännössä

Oppiva sääntö: referenssi/pointer parametrissa → forward declare. Return type / member → täydellinen include. IWYU auttaa. CppCoreGuidelines SF.11.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rs-forward)

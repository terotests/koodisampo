# Code review: C-style `(int)x` muunnos. Miksi static_cast on parempi?

## Tilanne

Legacy-tyylinen muunnos:

```cpp
double value = readSensor();
int rounded = (int)value;
```

C-style cast `(int)value` voi myös tehdä `const_cast`, `reinterpret_cast` tai `static_cast` — kääntäjä valitsee automaattisesti. Lukuvirheiden ja hakujen kannalta `(int)` on vaikea erottaa vaarallisesta `(Foo*)bar`.

## Ratkaisu

```cpp
int rounded = static_cast<int>(value);
```

`static_cast` on rajattu numeerisiin ja periytyviin muunnoksiin — näkyvä intentti, helpompi grep (`static_cast<int>`), vähemmän yllätyksiä. Muut tarpeet: `const_cast`, `reinterpret_cast`, `dynamic_cast` — jokainen erikseen ja perustellusti.

## Käytännössä

CppCoreGuidelines ES.48–ES.49: vältä C-style castia. Poikkeus: C-yhteensopivuus rajapinnoissa, mutta rajaa se wrapperiin.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Es-explicit-casts)

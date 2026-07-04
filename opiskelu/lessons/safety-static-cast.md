# Miksi `(int)x` on huonompi kuin `static_cast<int>(x)`?

## Tilanne

Code reviewissa näkyy C-tyylisiä muunnoksia:

```cpp
double ratio = compute();
int percent = (int)ratio;
void* p = (void*)buffer;
```

C-cast `(T)x` tekee **mitä tahansa**: `static_cast`, `const_cast`, `reinterpret_cast` tai niiden yhdistelmän — kääntäjä valitsee hiljaa. Refaktoroinnissa tyyppi muuttuu ja cast "toimii edelleen" mutta tekee väärän asian. `grep "(int)"` löytää myös funktiokutsuja — vaikea erottaa oikeat castit.

## Ratkaisu

C++-castit rajaavat intentin ja ovat **haettavissa**:

```cpp
int percent = static_cast<int>(ratio);       // numeerinen muunnos
auto* derived = dynamic_cast<Derived*>(base); // polymorfia
const int* ro = static_cast<const int*>(p);   // const-lisäys
```

`static_cast` on oikea valinta numeeriseen truncaukseen — selkeä intentio code reviewissa ja työkaluissa (clang-tidy, grep).

## Käytännössä

`reinterpret_cast` vain matalan tason bitfiddlingissä (serialisointi, hardware). Vältä kokonaan C-castia uudessa koodissa. `-Wold-style-cast` (GCC/Clang) varoittaa `(T)x`-käytöstä. CppCoreGuidelines ES.48–ES.49.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md)

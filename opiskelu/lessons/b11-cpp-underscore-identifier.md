# Uusi globaali funktio nimetään `_init_app()`. Miksi cpp-best-practices varoittaa?

## Tilanne

```cpp
void _init_app() { /* ... */ }
int _internal_state = 0;
```

C++ standardi **varaa** tunnisteet, jotka alkavat alaviivalla + isolla kirjaimella tai kaksinkertaisella alaviivalla tietyissä konteksteissa. Implementaatio (kääntäjä, standardikirjasto) voi käyttää samoja nimiä — törmäys tai UB.

## Ratkaisu

Käytä **normaalia nimeämistä** ilman varattuja prefiksejä:

```cpp
void initApp() { /* ... */ }
namespace app { void init(); }
```

Anonymi namespace sisäiselle linkage:lle `.cpp`-tiedostossa:

```cpp
namespace {
    int internalState = 0;
}
```

## Käytännössä

CppCoreGuidelines NL.9: don't use reserved names. `_` + lowercase ok vain class member / unused param -konventioissa (`_unused`). Review: "Nimeä uudelleen — varattu prefiksi."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)

# Mitä tarkoittaa undefined behavior (UB) C++:ssa?

## Tilanne

Koodi näyttää toimivan testeissä:

```cpp
int f(bool b) {
    int x = 42;
    if (b) return x;
    return x + 1;  // jos b aina true optimoinnissa...
}
```

Signed overflow, null dereference, data race, returning dangling reference — standardi sanoo: **mitä tahansa** voi tapahtua. Ohjelma ei ole velvollinen kaatumaan; se voi näyttää toimivan ja tuottaa väärää dataa tuotannossa.

## Mitä UB tarkoittaa

Kääntäjä saa olettaa, ettei UB:tä tapahdu, ja optimoida sen perusteella. Siksi "toimii debugissa" ei takaa mitään release-buildissa. UB ≠ implementation-defined (määritelty alustalla) eikä unspecified (joku käyttäytyminen, ei mielivaltainen).

## Käytännössä

- Käytä sanitizereitä (UBSan, ASan) CI:ssä.
- Vältä raakoja osoittimia, signed overflowia, kilpailevia säikeitä ilman synkronointia.
- Luota standardikirjastoon ja työkaluihin — älä "kikkaile" kääntäjän kanssa.

[Lue lisää](https://en.cppreference.com/w/cpp/language/ub)

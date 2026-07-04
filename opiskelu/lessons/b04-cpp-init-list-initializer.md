# Code review: `int x = 3.9;` kääntyy hiljaa — reviewer ehdottaa `int x{3.9};`. Miksi?

## Tilanne

Muuttujan alustus:

```cpp
int x = 3.9;   // truncaa 3.9 → 3, ei varoitusta (tai vain warning)
float y = 3.9;
int z = y;     // sama — hiljainen kapea muunnos
```

Copy-initialization sallii kapeat muunnokset usein ilman virhettä. Desimaaliarvo menetetään — bugi piilossa, kun kehittäjä olettaa pyöristyksen tai virheen.

## Ratkaisu

**Brace-init `{}`** estää narrowing:

```cpp
int x{3.9};   // kääntäjävirhe (tai -Wnarrowing varoitus)
int z{static_cast<int>(y)};  // tietoinen truncaus näkyvissä
```

Uniform initialization on tiukempi: `{3.9}` → `int` on narrowing conversion, joka on kielletty tai varoittava.

## Käytännössä

Prefer `{}` alustukseen numeerisille tyypeille. `-Wnarrowing` / `-Wconversion` auttavat. CppBestPractices Style: brace-init vähentää yllätyksiä. Poikkeus: `auto` deduktio — eri säännöt.

[Lue lisää](https://en.cppreference.com/w/cpp/language/list_initialization)

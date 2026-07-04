# Kaksi säiettä kirjoittaa samaan `int`-muuttujaan ilman synkronointia. Mitä C++ standardi sanoo?

## Tilanne

Jaettu laskuri ilman lukkoa:

```cpp
int balance = 0;

void deposit()  { balance += 100; }
void withdraw() { balance -= 50; }
```

Kaksi säiettä kutsuu funktioita samanaikaisesti. `balance += 100` on lue-muokkaa-kirjoita — ei atomista. Tulos voi olla vähemmän kuin odotettu, testit menevät läpi satunnaisesti.

## Ratkaisu

C++ standardi: **data race → undefined behavior ([UB](/docs/lyhenteet#ub))**.

Korjaus synkronoinnilla:

```cpp
std::atomic<int> balance{0};
// tai std::mutex + lock_guard
```

Data race ei ole "ehkä bugi" — se on UB. Optimointi voi tehdä mitä tahansa. TSan (ThreadSanitizer) havaitsee testeissä.

## Käytännössä

Jokainen jaettu kirjoitettava muuttuja: `atomic`, mutex, tai immuuttisuus (thread-local, message passing). CppCoreGuidelines CP.1–CP.2. `-fsanitize=thread` CI:ssä.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#CP.2)

# Mitä C++26:een hyväksytty staattinen reflektio (P2996) mahdollistaa?

## Ratkaisu

`^^T` tuottaa `std::meta::info`-arvon, jota voi kysellä (`members_of`, `identifier_of`, `enumerators_of`) ja jonka voi 'liittää' takaisin koodiksi splice-syntaksilla `[: r :]`. Käyttötapauksia ovat serialisointi, enum-merkkijonomuunnokset, ORM:t ja komentoriviparserit ilman koodigenerointia tai makroja.

## Käytännössä

Kääntäjätuki on vasta tulossa. Kokeile esim. Bloombergin clang-p2996-haaraa Compiler Explorerissa.


[Lue lisää](https://wg21.link/p2996)

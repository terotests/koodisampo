---
sidebar_position: 1
slug: /intro
title: Johdanto
---

# Opiskelumateriaali

Tämä sivusto on **erillinen pelistä**. Oppitunneissa ei viitata pelihahmoihin tai toimistotarinaan — vain tekninen sisältö.

Pelistä voit avata saman oppitunnin kysymyksen palautteen jälkeen linkistä **Lue oppitunti**.

## Rakenne

- **Yksi sivu per aihepiiri** — esim. [PostgreSQL](topics/postgres) on yksi pitkä scrollattava sivu
- Luvut (chapter) ovat `##`-otsikoita, yksittäiset kysymykset `###`-otsikoita
- Oikean reunan sisällysluettelo auttaa hyppäämään osioon
- Valmiit oppitunnit: [`opiskelu/lessons/`](https://github.com/terotests/koodisampo/tree/main/opiskelu/lessons)

## Linkki kysymyksestä

Kysymyspankin JSON-tiedostoissa (`content/question-banks/`) kenttä `lessonRef` dokumentoi polun:

```json
{
  "id": "tools-auto",
  "chapter": "tools",
  "lessonRef": "cpp/tools/tools-auto",
  "prompt": "Mitä `auto` tekee modernissa C++:ssa?"
}
```

Pelin linkki vie domain-sivulle ankkuriin: `/docs/topics/cpp/#tools-auto`.

Katso [edistyminen](progress) — kuinka monelle kysymykselle on kirjoitettu täysi oppitunti.

## Laajempi tausta

- [Opiskeluopas](https://github.com/terotests/koodisampo/blob/main/opiskelu/opiskelu-opas.md) — PIMPL, planning poker, …
- Ulkoiset lähteet: kunkin oppitunnin *Lue lisää* -osio

---
sidebar_position: 1
slug: /intro
title: Johdanto
---

# Opiskelumateriaali

Tämä sivusto on **erillinen pelistä**. Oppitunneissa ei viitata pelihahmoihin tai toimistotarinaan — vain tekninen sisältö.

Pelistä voit avata saman oppitunnin kysymyksen palautteen jälkeen linkistä **Lue oppitunti**.

## Rakenne

- **Aihepiirit** vasemmalla — domain (esim. C++, Docker) ja luku (chapter)
- Jokainen kysymys vastaa yhtä oppituntisivua (`domain/chapter/kysymys-id`)
- Valmiit oppitunnit löytyvät reposta kansiosta [`opiskelu/lessons/`](https://github.com/terotests/koodisampo/tree/main/opiskelu/lessons)

## Linkki kysymyksestä

Kysymyspankin JSON-tiedostoissa (`content/question-banks/`) kenttä `lessonRef` osoittaa oppituntiin:

```json
{
  "id": "tools-auto",
  "chapter": "tools",
  "lessonRef": "cpp/tools/tools-auto",
  "prompt": "Mitä `auto` tekee modernissa C++:ssa?"
}
```

Jos `lessonRef` puuttuu, polku johdetaan automaattisesti: `{domain}/{chapter}/{id}`.

Katso [edistyminen](progress) — kuinka monelle kysymykselle on kirjoitettu täysi oppitunti.

## Laajempi tausta

- [Opiskeluopas](../../opiskelu/opiskelu-opas.md) (repo) — PIMPL, planning poker, …
- Ulkoiset lähteet: kunkin oppitunnin *Lue lisää* -osio

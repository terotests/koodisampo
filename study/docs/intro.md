---
sidebar_position: 1
slug: /intro
title: Johdanto
---

# Opiskelumateriaali

Tämä sivusto on **erillinen pelistä**. Oppitunneissa ei viitata pelihahmoihin tai toimistotarinaan — vain tekninen sisältö.

Pelistä voit avata saman oppitunnin kysymyksen palautteen jälkeen linkistä **Lue oppitunti**.

## Rakenne

- **Yksi sivu per aihepiiri** — esim. [PostgreSQL](/docs/topics/postgres) on yksi pitkä scrollattava sivu
- Luvut (chapter) ovat `##`-otsikoita, yksittäiset kysymykset `###`-otsikoita
- Oikean reunan sisällysluettelo auttaa hyppäämään osioon
- **Valmis oppitunti** alkaa lainauslohkolla; **Luonnos** = vain oikea vastaus, täyttä tekstiä ei vielä
- Valmiit tiedostot repossa: [`opiskelu/lessons/`](https://github.com/terotests/koodisampo/tree/main/opiskelu/lessons)

## Paikallinen kehitys

`study/docs/topics/` generoidaan kysymyspankista — sitä ei commitoida. Ennen Docusaurusta:

```bash
npm run study:dev    # synkronoi + dev-palvelin (http://localhost:3000)
# tai erikseen:
npm run study:sync   # generoi topics/ + progress.md
npm run start --workspace=study
```

Uusi käsin kirjoitettu oppitunti: tallenna `opiskelu/lessons/{kysymys-id}.md`, aja `npm run study:sync`, ja se ilmestyy domain-sivun alle (esim. `#b03-pg-config-statements-ext`).

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

Katso [edistyminen](/docs/progress) — kuinka monelle kysymykselle on kirjoitettu täysi oppitunti.

## Laajempi tausta

- [Opiskeluopas](https://github.com/terotests/koodisampo/blob/main/opiskelu/opiskelu-opas.md) — PIMPL, planning poker, …
- Ulkoiset lähteet: kunkin oppitunnin *Lue lisää* -osio

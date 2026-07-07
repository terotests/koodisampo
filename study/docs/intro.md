---
sidebar_position: 1
slug: /intro
title: Johdanto
---

# Opiskelumateriaali

Tälle sivustolle on koottu Koodisammon oppitunnit selkeänä opiskelumateriaalina. Sisältö keskittyy teknisiin aiheisiin ilman pelihahmoja tai toimistotarinaa.

Jos pelaat Koodisampoa, voit avata saman aiheen suoraan pelistä kysymyksen palautteen jälkeen linkistä **Lue oppitunti**.

## Rakenne

- **Yksi sivu per aihepiiri** — esim. [PostgreSQL](/docs/topics/postgres) on yksi pitkä scrollattava sivu
- Luvut (chapter) ovat `##`-otsikoita, yksittäiset kysymykset `###`-otsikoita
- Oikean reunan sisällysluettelo auttaa hyppäämään osioon
- **Valmis oppitunti** alkaa viitteellä *Vaikeus N · kysymys `id`*; **Luonnos** = vain oikea vastaus, täyttä tekstiä ei vielä
- Valmiit tiedostot repossa: [`opiskelu/lessons/`](https://github.com/terotests/koodisampo/tree/main/opiskelu/lessons)
- Lyhenteet (GUC, OOM, RAII, …): [Lyhennehakemisto](/docs/lyhenteet) — oppitunneissa linkitetään automaattisesti synkronoinnissa

## Paikallinen kehitys

`study/docs/topics/` generoidaan kysymyspankista — sitä ei commitoida. Ennen Docusaurusta:

```bash
npm run study:dev    # synkronoi + dev-palvelin (http://localhost:3000)
# tai erikseen:
npm run study:sync   # generoi topics/
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

## Peli

- [Koodisampo](https://terotests.github.io/koodisampo/) — Corporate NetHack -tyylinen koodauspeli
- Ulkoiset lähteet: kunkin oppitunnin *Lue lisää* -osio

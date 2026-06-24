# Skenaariot — Ranger-simulaattori

JSON-skenaariot ajetaan headless-simulaattorilla:

```bash
npm run test:scenarios
# tai yksittäinen:
node scripts/run-scenario.mjs content/scenarios/courtyard-move.json
node scripts/run-scenario.mjs content/scenarios/courtyard-move.json --md
```

## Formaatti

```json
{
  "id": "courtyard-move",
  "seed": 42,
  "world": "corporate-hq-intro.json",
  "setup": {
    "clockMinutes": 480,
    "bootKarma": 50,
    "player": { "floor": 0 },
    "tool": "access_card"
  },
  "script": [
    { "move": "d" },
    { "tick": 15 },
    { "key": "2" },
    { "assert": { "floor": 1, "playerXMin": 14 } }
  ]
}
```

### setup

| Kenttä | Kuvaus |
|--------|--------|
| `seed` | RNG-siemen (deterministinen) |
| `clockMinutes` | Aloitusaika (480 = 08:00) |
| `bootKarma` | Karma bootstrapissa |
| `player.floor/x/y` | Pelaajan sijainti (oletus: spawn) |
| `player.hidden` | Piilossa |
| `tool` | Yksi työkalu (`access_card`, …) |
| `tools` | JSON-taulukko (objekteja, tuleva) |
| `progress.*` | `interviewPassed`, `guruIntroPassed`, … |

### script

| Toiminto | Esimerkki |
|----------|-----------|
| Liike | `{ "move": "d" }` tai `{ "move": "w", "repeat": 3 }` |
| Näppäin | `{ "key": "2" }` (hissi, encounter, …) |
| Aika | `{ "tick": 15 }` (minuuttia) |
| Assert | `{ "assert": { "floor": 1, "playerXMin": 14 } }` |

Liikenäppäimet: `w` ylös, `s` alas, `a` vasen, `d` oikein. (`e` = työkalu.)

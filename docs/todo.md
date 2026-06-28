# Toteutus TODO — tunne- ja simulaatiokerros (Ranger-first)

Lähdemateriaali: [`docs/plan.md`](plan.md)

**Tavoite:** Pelilogiikka mahdollisimman pitkälle Ranger-moottorissa (`lib/game/ranger/`). Hostit (web, terminaali, Android) ovat ohuita: snapshot, renderöinti, tallennus, syötteen välitys.

**Testaus:** `npm run test:engine` — jokainen vaihe tuottaa uusia headless-testejä ennen UI-pariteettia.

---

## Arkkitehtuurisäännöt

| Kerros | Missä | Esimerkki |
|--------|--------|-----------|
| **Pelilogiikka** | Ranger `.rgr` | tarpeet, suhteet, tapahtumat, game over |
| **Data** | `content/` JSON | tunnekysymykset, dialogiefektit, oletusarvot |
| **Lataus** | Ranger `StoryJson` / uusi `SimCatalog.rgr` | JSON → pelitila |
| **Testit** | `test/*.test.mjs` | `GameSession` / `simBootstrap` + `simStep` |
| **UI** | `hosts/`, `web-game/`, `android/` | vain näyttö + input |
| **Älä** | Host-JS liiketoimintalogiikka | ei `if (anger > 10)` webissä |
| **Älä UI:ssa** | NPC-suhdemittarit | ei anger/love/respect-palkkeja — vain reaktiot, dialogi, status-teksti |

**NPC-tunteet UI:ssa:** Pelaaja ei näe `anger`, `love`, `respect` jne. numeroina. Ne vaikuttavat vain:
- kohtaamisen sävyyn (greeting, kysymysteksti, vastausvaihtoehdot)
- `lastStatus`-viesteihin (esim. WC-häirintä, potkut)
- debug/sim-snapshotiin (`simDebugRelationsJson`) — ei tuotanto-UI:hin

Pelaajan omat tarpeet (`needs`: nälkä, jano) voivat tulla HUD:iin erikseen — ne eivät ole NPC-suhteita.

Olemassa oleva pohja:

- `GameSession.rgr` — ruudut, input, kohtaamiset
- `WorldMap.rgr` — liike, NPC, työkalut, emoji-flavor
- `WorldClock.rgr` — aika (+1 min / toiminto tänään)
- `FeatureKarma.rgr`, `PlayerConduct.rgr`, `PlayerTools.rgr`
- `simBootstrap` / `simStep` — headless-skenaariot (`test/scenario_sim.test.mjs`)
- `personStatus.mjs` — host-puolen rekisteri (laajennettava tai siirrettävä Rangeriin)

---

## Vaihe 0 — Aika ja pelaajan tarpeet

**Tavoite:** Korjaa plan.md:n “liian nopea päivä”. Pelaajalla on mitattavat tarpeet; toiminnot kuluttavat eri määrän aikaa.

### Ranger-toteutus

- [x] **`PlayerNeeds.rgr`** — `satiety`, `thirst`, `alertness`, `gas` (0..20)
- [x] **`PlayerCoreStats.rgr`** — `gender`, `intelligence`, `appearance`, `luck`, `intuition`, `humour` (1..20); arvonta `GameSession.reset` / `simBootstrap`
- [x] **`WorldClock.rgr`** — `spendTime(minutes)` kapseloi `advance` + palauttaa kulutetun ajan
- [x] **`GameSession.rgr`** — `afterTimedAction` / `spendTime` toimintokohtaisilla minuteilla
- [x] **`fn updatePlayerNeeds(minutes)`** — `PlayerNeeds.tickMinutes` kutsutaan `spendTime`:stä
- [x] **Game over** — `satiety <= 0` → nälkä; `thirst <= 0` → nestehukka
- [x] **`PlayerNeeds.applyEmojiChar`** — ☕ alertness+4/gas+1, 🍱 satiety+5, 🚽 gas−4
- [x] **`simExportState`** — `simSnapshotJson` sisältää `needs`

### Data

- [ ] `content/sim/player_defaults.json` — tarpeiden alkuarvot, kulutuskerroin / min
- [ ] `content/sim/time_costs.json` — toiminto → minuutit (Ranger lukee bootissa)

### Host (vain näyttö)

- [x] Snapshot-kentät: `needs`, `needsLine` (`createGameController`)
- [ ] Web status-palkki / Android HUD

### Unit-testit (`test/`)

| Tiedosto | Mitä testaa |
|----------|-------------|
| `player_needs.test.mjs` | ✅ `tickMinutes`, starvation game over |
| `time_costs.test.mjs` | ✅ Liike +1 min, simTick +15 min |
| `player_core_stats.test.mjs` | ✅ Seeded roll 1..20 |
| `emoji_effects.test.mjs` | ✅ Kahvi/lounas emoji Rangerissa |

**Ajetaan:** `npm run build:ranger && node test/player_needs.test.mjs …`

**Lisää** uudet testit `package.json` → `test:engine`-ketjuun.

---

## Vaihe 1 — NPC-suhde ja tunnekysymykset (plan.md V1)

**Tavoite:** Taustalaskenta muuttaa NPC:n suhdetta pelaajaan. Tunnekysymykset datassa, ei kovakoodattuna.

### Ranger-toteutus

- [ ] **`NpcRelation.rgr`** — kentät: `friendliness`, `respect`, `love`, `anger`, `jealousy`, `fear`, `suspicion`, `followTendency` (1..20); mood: `panic`, `stress`, `embarrassment` (0..20)
- [ ] **`NpcRelationStore.rgr`** (tai `GameSession`-taulu `npcId → NpcRelation`) — **Ranger on totuus**, ei host
- [ ] **`EmotionMath.rgr`** — `emotionChance(value)` plan.md §5 (ankkuroitu 1→0.01 %, 10→2 %, 20→20 %)
- [ ] **`fn tickNpcRelations()`** — kutsutaan 5 min välein `spendTime`:n kautta (ei joka minuutti)
- [ ] **`MapEntity` / NPC-tila** — yksinkertaistettu tilakone:
  - `mainTask`: `working` \| `coffee` \| `toilet` \| `eating` \| `seeking_player` \| `reporting` \| `investigating`
  - `overlayEmotion`: `none` \| `in_love` \| `angry` \| `panicked` \| `jealous`
- [ ] **`fn chooseNpcMainTask(npc)`** — päätös 5 min tikissä; hyödynnä olemassa `scheduleRole` / `npcState`
- [ ] **WC-sääntö** — `mainTask == toilet` + pelaaja puhuu → `anger` + (matkalla / istuessa eri määrä)
- [ ] **`DialogueCatalog.rgr`** — lataa `content/dialogues/**/*.json`; valitse node ehtojen mukaan
- [ ] **`fn applyDialogueEffects(effects[])`** — muuttaa `NpcRelation` / `PlayerNeeds` / `FeatureKarma`
- [ ] **`GameSession.onEncounterChoice`** — jos tunnekysymys: ei oikeaa/väärää, vain efektit
- [ ] **Tekninen vs tunne** — tekninen quiz (`encounterQuestions`) säilyy; tunne prioriteetti kun `anger≥10` tms.
- [ ] **Game over `Fired`** — ≥3 NPC:tä `anger >= 15` → `screen = gameover`
- [ ] **`lastStatus` säilyvyys** — ✅ jo tehty; varmista ettei uusi tik nollaa turhaan

### Data

- [ ] `content/dialogues/emotional/*.json` — neutraalit, uteliaat
- [ ] `content/dialogues/angry/*.json` — `requiredRelation: [{ stat: anger, min: 10 }]`
- [ ] `content/dialogues/romantic/*.json` — `romanticPreference` entity-datassa
- [ ] `content/dialogues/panic/*.json`
- [ ] `content/sim/emotion_curves.json` — dokumentoi ankkurit (Ranger lukee tai kovakoodaa `EmotionMath`)

### Host (vain näyttö + lataus)

- [ ] Poista / vähennä `personStatus.mjs`-logiikka joka duplikoi suhteita → lue snapshotista
- [ ] Encounter UI: tunnekysymys snapshotista — **ei anger-mittaria**, vain kysymys + vastaukset + status-reaktiot
- [ ] Debug: `simDebugRelationsJson` / dev-työkalu — ei tuotanto-HUD:ia

### Unit-testit

| Tiedosto | Mitä testaa |
|----------|-------------|
| `emotion_math.test.mjs` | `emotionChance(1)≈0.0001`, `(10)≈0.02`, `(20)=0.2` |
| `npc_relations.test.mjs` | `applyDialogueEffects` nostaa/laskee respectiä |
| `emotional_dialogue.test.mjs` | Angry NPC: `pickDialogue` palauttaa angry-setin; neutraali ei |
| `wc_anger.test.mjs` | NPC matkalla WC:lle + talk → anger kasvaa |
| `fired_gameover.test.mjs` | 3 NPC anger≥15 → game over syy `Fired` |
| `relation_tick.test.mjs` | 5 min välein tik ajetaan; 4 min ei aja täyttä päätöstä |

**Skenaariot:** laajenna `content/scenarios/` + `scenario_sim.test.mjs` (esim. `wc-anger.json`).

---

## Vaihe 2 — Tapahtumat ja havainto (plan.md V1→V2)

**Tavoite:** Rikkominen ja meteli eivät teleportoi tietoa. NPC havaitsee vain sen, minkä voi havaita.

### Ranger-toteutus

- [x] **`WorldEvent.rgr`** — `type`, `floor`, `x`, `y`, `time`, `noise`, `visibility`, `severity`, `suspiciousness`
- [x] **`WorldMap.pushEvent(event)`** — ring buffer (esim. 32 viimeistä)
- [x] **`tryBreakAt`** → `WallBroken` / `DoorBroken` event + kentät
- [x] **`fn canNpcNoticeEvent(npc, event)`** — etäisyys + `curiosity` + noise (plan.md §7)
- [x] **`fn onNpcNoticedEvent`** — `suspicion +=`, `mainTask = investigating`, status-viesti
- [x] **Rikkominen esineitä** — 💻 `ComputerBroken`, 🚽 `ToiletBroken` (`resolveTargetAt` / emoji entity)
- [x] **`PlayerFarted`** — `gas >= 15` + satunnaisuus → event; lähellä olevat NPC:t: respect/love −, anger +
- [x] **`fn computeReportScore(npc)`** — plan.md §12; ylitys → `mainTask = reporting`, security `seeking_player`
- [x] **`hasNearbyWitness`** — refaktoroi käyttämään event-lokia

### Data

- [x] `content/sim/event_types.json` — oletuskentät tyypeittäin

### Unit-testit

| Tiedosto | Mitä testaa |
|----------|-------------|
| `world_events.test.mjs` | `pushEvent` + `getRecentEvents` suodatus kerroksella |
| `perception.test.mjs` | Kaukainen hiljainen event → ei havaita; lähellä kova → havaitaan |
| `break_creates_event.test.mjs` | `tryBreakAt` lisää `WallBroken` noise≥15 |
| `fart_event.test.mjs` | Korkea gas → event; NPC lähellä suhde muuttuu |
| `reporting.test.mjs` | Korkea anger+suspicion → security reporting-tila |

---

## Vaihe 3 — Sosiaalinen kaaos (plan.md V2)

**Tavoite:** Juorut, paniikki, rakkaus, esineenetsintä — edelleen Rangerissa.

### Ranger-toteutus

- [x] **`GossipStarted` / `PraisePlayer` events** — 10 min tikissä
- [x] **`checkEscalation()`** — angry≥15 count, panicked count, jealous count → ryhmätapahtumat
- [x] **Rakkaus** — `love` kasvu: `appearance`, toistuvat kohtaamiset, `romanticPreference` MapEntityssä
- [x] **Rakkauden riskit** — `seek_player`, kateus naapureissa, HR-riski sopimattomassa käytöksessä
- [x] **`mainTask = searching_item`** + dialogi `HelpRequest`
- [x] **NPC→NPC kuiskaus** — `overheardMsg` kun pelaaja lähellä (laajenna `emitAmbient`)
- [x] **`WorkplaceEvacuated`** — liian monta `fleeing` → game over
- [x] **`screen = epilogue`** — loppuraportti: karma, attribuutit, vihamiehet, rakkaudet, HR-raportit

### Data

- [x] `content/dialogues/pack.json` — gossip/help/romantic (erilliset `gossip/*.json` / `help/*.json` valinnainen jatkossa)

### Unit-testit

| Tiedosto | Mitä testaa |
|----------|-------------|
| `escalation.test.mjs` | 3+ panicked → `WorkplacePanic` event |
| `love_mechanics.test.mjs` | Toistuvat flirttivastaukset nostavat lovea; torjunta → anger |
| `gossip.test.mjs` | Pelaaja lähellä kuulee gossip-eventin (`overheardMsg`) |
| `help_request.test.mjs` | NPC etsii USB:tä; pelaajalla item → respect + karma |
| `epilogue.test.mjs` | Game over → `simExport` sisältää yhteenvedon |

---

## Vaihe 4 — Täysi toimisto (plan.md V3)

**Tavoite:** HR-prosessi, auktoriteetit, vapaat esineet — ilman host-logiikkaa.

### Ranger-toteutus

- [ ] **`AuthorityNpc`** — HR / Security / Police erillinen päätöspuu
- [ ] **HR-kuulustelu** — ei välitöntä vankilaa; todisteet + dialogi
- [ ] **Pelaaja pudottaa/poimii** — `WorldMap.dropItem` / `pickupItem` (laajenna nykyistä)
- [ ] **`WorldObject.durability`** — kartta-objektit JSONista tai entity-tyypeistä
- [ ] **Maine / reputation** — kerros- tai yritystaso (valinnainen)

### Unit-testit

| Tiedosto | Mitä testaa |
|----------|-------------|
| `authority.test.mjs` | HR tutkii ennen pidätystä |
| `item_drop.test.mjs` | Pudota → poimi → toinen NPC näkee eventin |
| `full_day.test.mjs` | Skenaario: aamu → lounas → iltapäivä → lähtöaika |

---

## Testausstrategia (yleinen)

### Periaatteet

1. **Ranger ensin** — testaa `GameSession` / `WorldMap` suoraan `gameHost.dispatch`:lla
2. **`simBootstrap` + `simStep`** — toistettavat skenaariot ilman näppäimistöä (`content/scenarios/*.json`)
3. **Ei host-logiikan testejä** tunne-/tarveasioissa (paitsi snapshot-mappaus smoke)
4. **Determinismi** — `simBootstrap` seed `randomSeed` kun satunnaisuus mukana
5. **Regression** — jokainen bugi → uusi testi `test/`-hakemistoon
6. **Ajokerroin** — `npm run test:engine` aina ennen mergeä; `npm run build:ranger` pakollinen

### Testikerrokset

```
┌─────────────────────────────────────────┐
│ 1. Puhtaat Ranger-funktiot            │  emotion_math, applyEffects
├─────────────────────────────────────────┤
│ 2. GameSession + WorldMap integraatio │  player_needs, npc_relations
├─────────────────────────────────────────┤
│ 3. simStep-skenaariot                   │  scenario_sim, content/scenarios/
├─────────────────────────────────────────┤
│ 4. Controller smoke (valinnainen)       │  game_controller_*.test.mjs
├─────────────────────────────────────────┤
│ 5. UI / E2E (myöhemmin)                 │  Playwright, Android instrumented
└─────────────────────────────────────────┘
```

### Olemassa olevat testit (säilytä vihreänä)

- `story_engine`, `world_map`, `world_clock`, `encounter`, `actions`
- `game_controller_*`, `floor_access`, `npc_navigation`
- `emoji_feelings`, `map_glyphs`
- `scenario_sim`

### Uudet testit lisättävä `package.json` → `test:engine`

Vaihe 0 jälkeen:

```
test/player_needs.test.mjs
test/time_costs.test.mjs
test/player_core_stats.test.mjs
test/emoji_effects.test.mjs
```

Vaihe 1 jälkeen: `emotion_math`, `npc_relations`, `emotional_dialogue`, `wc_anger`, `fired_gameover`, `relation_tick`

Vaihe 2 jälkeen: `world_events`, `perception`, `break_creates_event`, `fart_event`, `reporting`

Vaihe 3 jälkeen: `escalation`, `love_mechanics`, `gossip`, `help_request`, `epilogue`

### Skenaariotiedostomalli

```json
{
  "seed": 42,
  "setup": { "floor": 1, "player": { "x": 4, "y": 1 } },
  "steps": [
    { "action": "move", "key": "d" },
    { "expect": { "statusContains": "helpottuneeksi", "satiety": { "min": 1 } } }
  ]
}
```

Aja: `node scripts/run-scenario.mjs content/scenarios/wc-feeling.json`

---

## Ranger-tiedostokartta (tavoite)

```
lib/game/ranger/
  PlayerNeeds.rgr          ← Vaihe 0
  PlayerCoreStats.rgr      ← Vaihe 0
  EmotionMath.rgr          ← Vaihe 1
  NpcRelation.rgr          ← Vaihe 1
  NpcRelationStore.rgr     ← Vaihe 1
  DialogueCatalog.rgr      ← Vaihe 1
  WorldEvent.rgr           ← Vaihe 2
  WorldMap.rgr               (laajennus)
  GameSession.rgr            (orchestraatio)
  WorldClock.rgr             (spendTime)
  process/GameSession.rgr
```

`KoodisampoLib.rgr` — importtaa uudet luokat.

---

## Host-rajat (ei pelilogiikkaa)

| Sallittu hostissa | Kielletty hostissa |
|-------------------|-------------------|
| Snapshot → UI | `status`, `encounter.question`, `choices[]` |
| Älä snapshot → UI | `anger`, `love`, `respect`, `overlayEmotion`, `npcRelations` |
| JSON lataus tiedostosta → syötä Rangerille bootissa | Tunnekysymyksen valinta |
| Tallennus / lataus levyltä | Game over -ehdot |
| Teknisten kysymysten pankki (jos ei siirretä Rangeriin) | NPC-liike / pathfinding |
| `mapGlyphs`, renderöinti | Ajan kulumisen laskenta |

**Pitkän aikavälin tavoite:** siirrä `encounterQuestions.mjs` valinta Rangerin `DialogueCatalog`iin; host näyttää vain `encounter.questionText` + `choices[]` snapshotista.

---

## Prioriteettijärjestys

1. ✅ Emoji flavor + status säilyvyys (`emoji_feelings`, `lastStatus`)
2. ✅ **Vaihe 0** — aika + tarpeet (pelattava silmukka)
3. ✅ **Vaihe 1** — NpcRelation + tunnekysymykset (plan.md ydin)
4. ✅ **Vaihe 2** — WorldEvent + havainto
5. ✅ **Vaihe 3** — gossip, paniikki, epilogue
6. **Vaihe 4** — HR-prosessi, täysi esinepello

---

## Valmiusmerkinnät

Käytä tätä tiedostoa living docina. Merkitse valmiiksi:

- `[x]` tehty ja testit vihreät
- `[~]` osittain (mainitse mitä puuttuu)
- `[ ]` tekemättä

Päivitä tämä lista kun vaihe valmistuu.

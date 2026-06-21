# Story JSON -skeema

Jokainen tarina on yksi JSON-tiedosto. Solmut (`nodes`) muodostavat suunnatun graafin: monivalinnat haarautuvat, kuolema (`outcome: death`) päättää tarinan, voitto jatkaa etenemistä.

## Juuri

```json
{
  "id": "unique-id",
  "title": "Näytettävä otsikko",
  "topic": "cpp",
  "description": "Lyhyt kuvaus listanäkymässä",
  "sortOrder": 20,
  "teaches": ["cpp:const-ref", "cpp:pass-by-value"],
  "sourceRef": "cpp-best-practices/04-Considering_Safety.md",
  "estimatedMinutes": 12,
  "isFinale": false,
  "startNode": "intro",
  "nodes": { ... }
}
```

| Kenttä | Kuvaus |
|--------|--------|
| `sortOrder` | Tarinalistan järjestys (ei näy käyttäjälle) |
| `teaches` | Feature-id:t joita tarina voi opettaa (näkyy kortilla) |
| `sourceRef` | Viittaus oppimateriaaliin |
| `estimatedMinutes` | Arvioitu kesto |
| `isFinale` | Väinämöisen haaste tms. — koodin kirjoittamista |
| `startNode` | Ensimmäisen solmun avain |

## Featuret ja karma

Oikeasta vastauksesta kasvaa **karmaa** ilman ylärajaa. Feature-id esim. `cpp:auto` (kieli:pattern).

```json
{
  "id": "a",
  "text": "Vastaus",
  "correct": true,
  "features": [{ "id": "cpp:auto", "karma": 5 }]
}
```

Koodivaiheessa:

```json
{
  "type": "code",
  "features": [{ "id": "cpp:const-correctness" }],
  ...
}
```

Oletuskarma: monivalinta 3, koodi 5. Uudet featuret voi lisätä tarinoihin — tuntemattomat id:t näytetään sellaisenaan kunnes lisätään `features/catalog.ts`.

## Solmutyypit

### `narrative` — tarinateksti

```json
{
  "type": "narrative",
  "title": "Valinnainen otsikko",
  "text": "Kertomus.",
  "next": "seuraava-solmu"
}
```

### `choice` — monivalinta

```json
{
  "type": "choice",
  "text": "Kysymys",
  "choices": [
    {
      "id": "a",
      "text": "Vastaus",
      "feedback": "Palaute",
      "next": "solmu-id",
      "correct": true,
      "features": [{ "id": "cpp:auto" }]
    }
  ]
}
```

### `code` — koodin täydennys

```json
{
  "type": "code",
  "template": "_____ x = 42;",
  "answers": ["auto"],
  "features": [{ "id": "cpp:auto", "karma": 8 }],
  "feedbackCorrect": "Oikein!",
  "feedbackWrong": "Yritä uudelleen",
  "next": "voitto"
}
```

### `end` — tarinan loppu

`outcome`: `victory` | `death` | `neutral`

## Selaimen historia (back-nappi)

Jokainen tehtävävaihe lisää historian merkinnän. Back palauttaa edelliseen vaiheeseen pelin sisällä.

## IndexedDB

- **progress** — tarinan edistyminen
- **results** — vastaukset
- **features** — kertyvä karma featureittain
- **stats** — `totalKarma`, suoritetut tarinat

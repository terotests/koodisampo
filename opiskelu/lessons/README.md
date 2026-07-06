# Oppitunnit (pelihahmottomat)

Yksi tiedosto per kysymys-id (`content/question-banks`). Nimet: `{question-id}.md`.

Nämä synkronoidaan Docusaurus-sivustolle:

```bash
npm run study:sync      # generoi study/docs/topics/
npm run study:dev       # synkronoi + paikallinen dev-palvelin
npm run build:study     # tuotantobuild
```

Julkaistaan opiskelusivuston oppituntiosioon.

Tuo vanha `oppitunnit.md` tähän (ilman pelihahmoja):

```bash
npm run study:import
```

Edistyminen: [`TODO.md`](TODO.md) (generoitu kysymyspankista) · `npm run study:todo` · `npm run study:progress`

## Kirjoitusohje (manuaalinen työ osissa)

Oppitunnit laajennetaan **käsin** kysymys kerrallaan tai pieninä erinä (esim. yksi luku / domain kerrallaan). Sisältöä ei generoida automaattisesti — vain todo-lista päivittyy skriptillä.

Tiedosto `opiskelu/lessons/{question-id}.md`:

1. Ensimmäinen rivi `# {sama kuin kysymyspankin prompt}` — synkki poistaa duplikaattiotsikon.
2. Jokaisessa osiossa **2–4 kappaletta** (## Tilanne, ## Ratkaisu, ## Käyttöönotto / ## Taustaa tms.).
3. **Ei** "Miksi muut eivät kelpaa?" -listaa — väärät vaihtoehdot kuuluvat peliin, ei oppitunnille.
4. Linkitä virallinen lähde (`sourceUrl` kysymyspankissa) lopussa tai upota `[Lue lisää](url)`.
5. Lyhenteet (GUC, OOM, RAII, …): älä toista pitkiä selityksiä joka kerta — ne linkitetään automaattisesti [lyhennehakemistoon](/docs/lyhenteet) `npm run study:sync`:ssä. Uusi lyhenne: lisää `opiskelu/lyhenteet.md` muodossa `### TERM {#anchor}`.

Esimerkki valmiista laajasta oppitunnista: `b03-pg-config-statements-ext.md`.

## Todo ja edistyminen

```bash
npm run study:todo   # päivitä TODO.md + TODO.json (valmis = .md tiedosto olemassa)
```

- [`TODO.md`](TODO.md) — kaikki domainit ja luvut, ✅/⬜ per kysymys
- [`TODO.json`](TODO.json) — sama koneellisesti (CI, agentit)

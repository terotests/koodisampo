# Oppitunnit (pelihahmottomat)

Yksi tiedosto per kysymys-id (`content/question-banks`). Nimet: `{question-id}.md`.

Nämä synkronoidaan Docusaurus-sivustolle:

```bash
npm run study:sync
npm run build:study
```

Julkaistu osoitteessa: https://terotests.github.io/koodisampo/opiskelu/

Tuo vanha `oppitunnit.md` tähän (ilman pelihahmoja):

```bash
npm run study:import
```

Edistyminen: `npm run study:progress` tai sivu `/docs/progress`.

## Kirjoitusohje (manuaalinen työ osissa)

Oppitunnit laajennetaan **käsin** kysymys kerrallaan tai pieninä erinä (esim. yksi luku / domain kerrallaan). Älä generoi massana skriptillä.

Tiedosto `opiskelu/lessons/{question-id}.md`:

1. Ensimmäinen rivi `# {sama kuin kysymyspankin prompt}` — synkki poistaa duplikaattiotsikon.
2. Jokaisessa osiossa **2–4 kappaletta** (## Tilanne, ## Ratkaisu, ## Käyttöönotto / ## Taustaa tms.).
3. **Ei** "Miksi muut eivät kelpaa?" -listaa — väärät vaihtoehdot kuuluvat peliin, ei oppitunnille.
4. Linkitä virallinen lähde (`sourceUrl` kysymyspankissa) lopussa tai upota `[Lue lisää](url)`.

Esimerkki valmiista laajasta oppitunnista: `b03-pg-config-statements-ext.md`.

## Erät (edistyminen)

| Erä | Scope | Tila |
|-----|-------|------|
| 1 | `postgres` / `pg-config` — diff 3+ | osittain (`b03-pg-config-statements-ext` valmis) |
| 2 | `postgres` / muut luvut | odottaa |
| 3 | `cpp` — olemassa olevat lyhyet tiedostot | odottaa laajennusta |
| … | muut domainit | odottaa |

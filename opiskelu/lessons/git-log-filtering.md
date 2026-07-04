# Haluat nähdä vain yhden tiedoston muutoshistorian viimeisen kuukauden ajalta. Mikä komento?

## Tilanne

`git log` tulostaa koko projektin historian — tuhansia rivejä. Tarvitset: "kuka muutti `src/auth.js` viime kuussa ja miksi?" Blame yhdelle riville ei riitä — haluat commit-viestit ja diffit.

## Ratkaisu

**`git log`** polulla ja aikarajalla:

```bash
git log --since='1 month ago' -- src/auth.js

git log -p --since='2026-01-01' --follow -- src/auth.js
```

`-p` näyttää patchin. `--follow` seuraa renamea. `--author`, `--grep` rajaa lisää.

## Käytännössä

```bash
git log --oneline --graph --since='2 weeks ago' -- package.json
git shortlog -sn --since='1 month ago'   # kuka committasi eniten
```

Incident-debug: löydä commit joka rikkoi tiedoston. `git bisect` jos tarvitset binäärihaun.

[Lue lisää](https://git-scm.com/docs/git-log)

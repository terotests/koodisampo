# Viimeisin commit mainiin on buginen ja kollegat ovat jo pullanneet sen. Miten korjaat turvallisesti?

## Tilanne

Bugi meni suoraan `main`:iin. Kollegat ovat jo `git pull` — heidän historiassaan commit on olemassa. `git reset --hard HEAD~1` + force push **tuhoaisi jaetun historian** ja aiheuttaisi kollegoiden repojen ristiriitoja.

Jaetussa branchissa historiaa ei saa kirjoittaa uudelleen ilman tiimin koordinaatiota.

## Ratkaisu

**`git revert`** — luo **käänteisen commitin** ilman historian uudelleenkirjoitusta:

```bash
git revert abc1234   # buginen commit
git push origin main
```

Historia näyttää: bugi-commit → revert-commit. Kollegat `pull` normaalisti — ei force pushia.

## Käytännössä

`revert` jaetulle `main`/`develop`:ille. `reset --hard` vain paikalliseen tai feature-branchiin ennen jakamista. Useita commiteja: `git revert sha1 sha2` tai revert merge `-m 1`. Review: "Revert, älä reset mainissa."

[Lue lisää](https://git-scm.com/docs/git-revert)

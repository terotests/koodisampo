# git merge tuottaa CONFLICT-merkintöjä tiedostoon. Mikä on oikea työnkulku konfliktin ratkaisemiseksi?

## Tilanne

```bash
git merge feature/api
# Auto-merging config.json
# CONFLICT (content): Merge conflict in config.json
```

Tiedostossa:

```
<<<<<<< HEAD
"port": 8080
=======
"port": 3000
>>>>>>> feature/api
```

Buildi ei etene ennen ratkaisua. Väärä ratkaisu voi yhdistää molemmat portit tai jättää markerit tiedostoon — tuotantoon menee rikkinäinen JSON.

## Ratkaisu

1. Avaa konfliktitiedosto — valitse oikea sisältö (tai yhdistä molemmat tietoisesti)
2. Poista `<<<<<<<`, `=======`, `>>>>>>>` markerit
3. **`git add config.json`**
4. **`git commit`** (tai `git merge --continue`)

```bash
git status          # näkee konfliktitiedostot
# muokkaa tiedostoa
git add config.json
git commit -m "Merge feature/api — resolve port conflict"
```

## Käytännössä

`git mergetool` avaa GUI:n. `git merge --abort` peruu merge. Konfliktit ennen mergeä: `git diff main...feature`. Tiimi: pienet PR:t → vähemmän konflikteja.

[Lue lisää](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented)

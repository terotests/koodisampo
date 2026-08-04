# Feature-branch perustui vanhaan mainiin. Main on edennyt ja haluat siirtää vain feature-commitit uuden mainin päälle. Komento?

## Tilanne

Historia:

```
main:    A---B---C---D
              \
feature:       E---F---G
```

`E` pohjautui `B`:hen. Main on nyt `D`. Haluat `E..G`:n `D`:n päälle ilman, että otat mukaan vanhoja mergejä tai turhia välikomitseja väärästä pohjasta. Tavallinen `git rebase main` toimii usein, mutta kun välissä on merge-base-hämminkiä tai haluat eksplisiittisen rajan, tarvitaan `--onto`.

## Ratkaisu

```bash
git rebase --onto main <vanha-pohja> feature
# esim. vanha-pohja = B (commit johon feature alun perin perustui)
git rebase --onto main B feature
```

`--onto main` = uusi pohja. `<vanha-pohja>` = commit jonka *jälkeiset* commitit siirretään (ei itseään). Feature-commitit `E..G` uudelleenkirjoitetaan `D`:n päälle.

## Käytännössä

- Tee ennen: `git fetch` ja varmista tipit (`git log --oneline --graph`).
- Force-push feature-branchiin vain tiimin sopimuksella (`--force-with-lease`).
- Jos feature sisältää merge-commiteja, harkitse `rebase -i` siivousta ensin.

[Lue lisää](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---onto)

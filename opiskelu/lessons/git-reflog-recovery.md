# Paikallinen branch näyttää tyhjältä commit-historian jälkeen, mutta tiedät että työtä on kadonnut vasta äskettäin. Mikä Git-mekanismi säilyttää HEAD-siirtojen historian palautusta varten?

## Tilanne

Luulit olevasi feature-branchissa:

```bash
git reset --hard origin/main   # väärä branch — 3 committia katosi
```

Commitit eivät näy `git log`:issa — mutta Git **ei poista heti** objekteja. Reflog muistaa missä HEAD on ollut.

## Ratkaisu

**`git reflog`**:

```bash
git reflog
# abc1234 HEAD@{1}: commit: login validation complete
git checkout abc1234
# tai
git branch recovery abc1234
git reset --hard abc1234
```

Reflog säilyttää HEAD-liikkeet ~90 päivää oletuksena. Löydä commit ennen resetiä → palauta siihen.

## Käytännössä

`git fsck --lost-found` viimeinen keino. Ennaltaehkäisy: push feature-branch usein — remote on backup. Älä `reset --hard` ilman varmistusta branchista (`git branch --show-current`).

[Lue lisää](https://git-scm.com/docs/git-reflog)

# Feature-branchissa on 5 pientä committia jotka pitäisi yhdistää siistiksi ennen PR:n luontia. Mikä toimii?

## Tilanne

Feature-branch historiassa:

```
fix typo
WIP
fix tests
more WIP
actually fix login
```

PR-review on vaikeaa — "fix typo" ja "WIP" eivät kerro tarinaa. Haluat **yhden selkeän commitin** ennen mergeä, mutta et halua menettää muutoksia.

## Ratkaisu

**Interactive rebase**:

```bash
git rebase -i HEAD~5
```

Editorissa:

```
pick abc1234 fix typo
squash def5678 WIP
pick ...
squash ...
pick ...
```

`squash` / `fixup` yhdistää commitit edelliseen. `reword` muuttaa viestin. Lopuksi: `git push --force-with-lease`.

## Käytännössä

Squash vain **omat** commitit ennen PR:ää — älä rewrite jaettua mainia. Tiimi: "Squash merge" GitHubissa vs rebase locally — sovi käytäntö. `fixup` jättää squashattujen viestit pois.

[Lue lisää](https://git-scm.com/docs/git-rebase#_interactive_mode)

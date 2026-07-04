# Haluat tuoda yksittäisen commitin toisesta branchista ilman koko haaran mergeä. Mikä komento?

## Tilanne

Hotfix on mergetty `release`-branchiin, mutta sinun feature-branch tarvitsee **vain yhden commitin** — esim. tietoturvakorjauksen — ilman koko releasen muita muutoksia. `git merge release` tuo satoja tiedostoja ja aiheuttaa konflikteja feature-työn kanssa.

Tarve: kopioi yksi commit nykyiseen branchiin, säilytä selkeä historia.

## Ratkaisu

**`git cherry-pick <commit-sha>`**:

```bash
git checkout feature/login
git cherry-pick abc1234   # hotfix-commit release-branchista
```

Git soveltaa commitin diffin uutena commitina feature-branchille. Konfliktit ratkaistaan kuten mergessä: muokkaa tiedosto, `git add`, `git cherry-pick --continue`.

Useita commiteja peräkkäin: `git cherry-pick sha1 sha2` tai `git cherry-pick sha1..sha5`.

## Käytännössä

Cherry-pick luo **uuden SHA:n** — sama muutos, eri commit-id. Älä cherry-pickaa merge-commiteja ilman `-m`. PR-reviewissa dokumentoi mistä commit otettiin. Vaihtoehto: `git revert` jos tarvitset käänteisen muutoksen.

[Lue lisää](https://git-scm.com/docs/git-cherry-pick)

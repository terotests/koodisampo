# Haluat työstää kahta branchia samanaikaisesti ilman stashia tai committia keskeneräisistä muutoksista. Mikä auttaa?

## Tilanne

Feature-branch kesken — hotfix vaatii välittömästi toisen branchin. Stash toimii, mutta IDE:n konteksti vaihtuu, build-kansiot sekoittuvat. Haluat **kaksi working treea** samasta reposta rinnakkain.

## Ratkaisu

**`git worktree`**:

```bash
git worktree add ../hotfix-work hotfix/prod-bug
cd ../hotfix-work
# korjaa, commit, push
git worktree remove ../hotfix-work
```

Sama `.git`, eri checkout-kansio. Feature jää alkuperäiseen kansioon koskematta.

## Käytännössä

`git worktree list` — hallitse aktiiviset. Älä checkout samaa branchia kahdessa worktreessä. CI/build-kansiot erikseen per worktree. Vaihtoehto: toinen clone jos worktree liian monimutkainen.

[Lue lisää](https://git-scm.com/docs/git-worktree)

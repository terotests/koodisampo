# Keskeneräinen työ pitää siirtää sivuun nopeasti ilman committia esim. branchin vaihdon ajaksi. Miten?

## Tilanne

Olet kesken login-featuren — koodi ei käännä, testit punaisina. Tuotantobugi vaatii välittömästi switchin `hotfix`-branchiin. Commit "WIP" likaisi historian; hylätä työ ei ole vaihtoehto.

Tarvitset puhtaan working treen toiseen branchiin ilman half-baked committia.

## Ratkaisu

**`git stash`**:

```bash
git stash push -m "WIP login form validation"
git checkout hotfix/prod-bug
# korjaa, commit, push
git checkout feature/login
git stash pop   # tai git stash apply
```

Stash tallentaa staged + unstaged muutokset pinolle. Working tree puhdistuu. `stash list` näyttaa pinon; `pop` palauttaa ja poistaa, `apply` jättää kopion.

## Käytännössä

`git stash -u` sisältää untracked tiedostot. Nimeä stash `-m`:llä — helpottaa `stash list`:ssä. Pitkäaikainen stash voi aiheuttaa konflikteja `pop`:issa — apply turvallisempi ensin. CppBestPractices-tyylinen selkeys: stash on väliaikainen, ei varastointi viikkojen WIP:lle.

[Lue lisää](https://git-scm.com/docs/git-stash)

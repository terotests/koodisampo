# Koko repo formatoitiin yhdellä commitilla, ja nyt git blame näyttää lähes jokaiselle riville vain formatointicommitin. Miten saat alkuperäiset tekijät näkyviin?

## Tilanne

Tiimi otti käyttöön Prettierin (tai clang-formatin) ja formatoi koko repositorion yhdellä commitilla. Nyt `git blame` näyttää lähes jokaisen rivin tekijäksi formatointicommitin, eikä koodin historiaa voi enää selvittää.

## Ratkaisu

Listaa massamuutoscommitit tiedostoon ja kerro Gitille, että ne ohitetaan:

```bash
echo "# Prettier-formatointi 2024-05" >> .git-blame-ignore-revs
git rev-parse <formatointicommit> >> .git-blame-ignore-revs
git add .git-blame-ignore-revs && git commit -m "Ignore formatting commit in blame"

git config blame.ignoreRevsFile .git-blame-ignore-revs
```

Tämän jälkeen `git blame` näyttää jokaiselle riville viimeisimmän merkityksellisen muutoksen.

## Taustaa

`--ignore-revs-file` (tai asetus `blame.ignoreRevsFile`) ohittaa luetellut commitit ja etsii rivin alkuperän niitä edeltävästä historiasta. GitHub ja GitLab tunnistavat saman tiedostonimen automaattisesti web-näkymän blamessa.

Formatointicommitin peruminen tai jaetun mainin historian uudelleenkirjoitus rebasella rikkoisi kaikkien muiden kloonit. Jatkossa massamuutokset kannattaa tehdä omina commiteinaan juuri siksi, että ne voi lisätä tähän listaan.

[Lue lisää](https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revs-fileltfilegt)

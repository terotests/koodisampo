# Release pitää merkitä niin että CI voi triggata deployment tietystä versiosta. Mikä on paras tapa?

## Tilanne

Deploy pitää käynnistyä versiosta `1.2.0` — ei "viimeisimmästä commitista mainissa", joka voi muuttua minuutin päästä. CI tarvitsee **stabilin viitteen** johon triggata. Lightweight tag (`git tag v1.2.0`) toimii, mutta ei kerro kuka tagasi tai milloin.

## Ratkaisu

**Annotoitu tag**:

```bash
git tag -a v1.2.0 -m "Release 1.2.0 — login fix, API v2"
git push origin v1.2.0
```

CI trigger: push tag `v*` → deploy staging/prod. GitHub Actions: `on: push: tags: ['v*']`.

## Käytännössä

Semantic versioning (`v1.2.0`). Älä liiku tagia — uusi versio = uusi tag. `git describe --tags` build-numeroihin. Signed tags (`-s`) turvallisuuskriittisissä releaseissä.

[Lue lisää](https://git-scm.com/docs/git-tag)

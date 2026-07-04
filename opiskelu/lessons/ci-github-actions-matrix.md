# Projekti pitää testata kolmella Node-versiolla ja kahdella käyttöjärjestelmällä. Miten GitHub Actionsissa?

## Tilanne

Sovellus tukee Node 18–20, Linux ja Windows. Yksi runner testaa vain yhden yhdistelmän — bugi Windows + Node 16 jää huomaamatta. Manuaalinen matrix 6 jobia copy-pastella driftaa.

## Ratkaisu

**Matrix strategy**:

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci && npm test
```

GitHub ajaa kaikki 6 yhdistelmää rinnakkain (tai osittain).

## Käytännössä

`fail-fast: false` — näe kaikki failit kerralla. Exclude harvinaiset yhdistelmät: `exclude:`. Include lisäyhdistelmät. Cache key: `${{ matrix.os }}-${{ hashFiles('package-lock.json') }}`.

[Lue lisää](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)

# CI käyttää dependency-cachea mutta buildit saavat satunnaisesti väärät paketit. Mikä cache-avaimessa pitää huomioida?

## Tilanne

GitHub Actions cache:

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: npm-cache
```

`package-lock.json` muuttuu — mutta cache key pysyy `npm-cache` → vanha `node_modules` palautuu → build käyttää **väärää dependency-settiä**. Satunnainen fail kun cache hit osuu väärään versioon.

## Ratkaisu

**Lockfile hash cache-avaimessa**:

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: npm-${{ hashFiles('package-lock.json') }}
    restore-keys: npm-
```

Kun lockfile muuttuu → uusi key → cache miss → tuore `npm ci`. `restore-keys` fallback osittaiseen cacheen.

## Käytännössä

Sama `yarn.lock`, `pnpm-lock.yaml`, `Cargo.lock`. Prefer `npm ci` lockfilella — ei `npm install`. Invalidate cache tietoisesti lockfile-bumpilla. CppBestPractices-tyylinen determinismi: lockfile on totuus.

[Lue lisää](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

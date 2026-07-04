# CI-pipelinessa unit-testit ja lintterit voitaisiin ajaa rinnakkain nopeuttamaan buildia. Miten toteutat?

## Tilanne

Sekvenssinen pipeline:

```
lint (2 min) → unit tests (5 min) → e2e (10 min)  = 17 min
```

Lint ja unit eivät riipu toisistaan — rinnakkain säästää 2 min per build. 50 buildiä/päivä → merkittävä säästö.

## Ratkaisu

**Parallel stages** (Jenkins):

```groovy
stage('Quality') {
    parallel {
        stage('Lint') { steps { sh 'npm run lint' } }
        stage('Unit') { steps { sh 'npm test' } }
    }
}
```

GitHub Actions:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  test:
    runs-on: ubuntu-latest
    steps: [...]
```

Jobs ajetaan rinnakkain oletuksena.

## Käytännössä

Rinnakkain vain **riippumattomat** vaiheet — deploy vaatii buildin valmiiksi. Matrix × parallel kasvattaa agent-kuormaa. Cache jaettuna jobien välillä lockfile-hashilla.

[Lue lisää](https://www.jenkins.io/doc/book/pipeline/syntax/#parallel)

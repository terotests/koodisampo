# CI-build tuottaa binäärin joka pitää olla ladattavissa myöhemmin QA-testaajille. Miten tallennat?

## Tilanne

CI kääntää `app-v1.2.0.jar` — QA haluaa testata saman binäärin viikon päästä. Ilman artefaktia build-kone tyhjentyy ja binääri on kadonnut. "Build again from tag" ei takaa identtistä tulosta jos riippuvuudet muuttuivat.

## Ratkaisu

**Artefaktien tallennus** CI:ssä:

```yaml
# GitHub Actions
- uses: actions/upload-artifact@v4
  with:
    name: app-binary
    path: dist/app.jar
    retention-days: 30
```

Jenkins: `archiveArtifacts artifacts: 'dist/*.jar'`. QA lataa CI-UI:sta tai API:sta.

## Käytännössä

Nimeä artefakti version/tag mukaan. Retention policy — älä täytä storagea loputtomiin. Release: artefakti + git tag yhdessä. Sentry/debug: säilytä symbolit erikseen.

[Lue lisää](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)

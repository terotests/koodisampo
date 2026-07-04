# Robot Framework -testien tulokset pitää raportoida Jenkinsiin. Mikä tulosformaatti integroituu?

## Tilanne

CI-putki ajaa Robot Framework -testit palvelimella, mutta Jenkins näyttää vain "Build failed" ilman testikohtaista näkymää: montako testiä meni läpi, mitkä epäonnistuivat, kuinka kauan ne kestivä. Kehittäjät lataavat `log.html`-tiedoston manuaalisesti artefakteista.

Jenkins (kuten GitLab CI ja GitHub Actions) ymmärtää natiivisti JUnit XML -muotoa testituloksille. Robot Framework tuottaa oletuksena oman `output.xml`-muotonsa, mutta se voidaan muuntaa CI-ystävälliseen formaattiin ajon yhteydessä.

## Ratkaisu

**robot --xunit output.xml tuottaa JUnit-muotoisen raportin jonka Jenkins parsii natiivisti.**

```bash
robot --outputdir results --xunit xunit.xml tests/
```

Jenkins Pipeline -esimerkki:

```groovy
stage('Test') {
    sh 'robot --xunit results/xunit.xml tests/'
    junit 'results/xunit.xml'
}
```

`junit`-askel parsii XML:n ja näyttää trendit, epäonnistuneet testit ja linkit raportteihin. `--xunit` tuottaa standardin JUnit XML:n jota Jenkins, GitLab ja GitHub Actions ymmärtävät.

## Käytännössä

Arkistoi myös Robotin oma `log.html` ja `report.html` CI-artefakteina — ne tarjoavat yksityiskohtaisemman debug-näkymän kuin JUnit-yhteenveto. GitHub Actionsissa käytä `publish-unit-test-result`-actionia; GitLabissa `reports: junit:`. Sama `--xunit`-tiedosto toimii kaikissa.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#xunit-compatible-result-file)

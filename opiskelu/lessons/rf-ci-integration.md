# Robot Framework -testien tulokset pitää raportoida Jenkinsiin. Mikä tulosformaatti integroituu?

## Tilanne

CI-putki ajaa Robot Framework -testit palvelimella, mutta Jenkins näyttää vain "Build failed" ilman testikohtaista näkymää: montako testiä meni läpi, mitkä epäonnistuivat, kuinka kauan ne kestivät. Kehittäjät lataavat `log.html`-tiedoston manuaalisesti artefakteista.

Jenkins (kuten GitLab CI ja GitHub Actions) ymmärtää natiivisti JUnit XML -muotoa testituloksille. Robot Framework tuottaa oletuksena oman `output.xml`-muotonsa, mutta se voidaan muuntaa CI-ystävälliseen formaattiin ajon yhteydessä.

## Ratkaisu

**robot --xunit output.xml tuottaa JUnit-muotoisen raportin jonka Jenkins parsii natiivisti.**

```bash
robot --outputdir results --xunit xunit.xml tests/
```

Jenkins Pipeline -esimerkki:

```groovy
stage('Test') {
    sh 'robot --outputdir results --xunit results/xunit.xml tests/'
    junit 'results/xunit.xml'
}
```

`junit`-askel parsii XML:n ja näyttää trendit, epäonnistuneet testit ja linkit raportteihin.

## Käytännössä

Tallenna CI:ssä ainakin:

- `output.xml`
- `log.html`
- `report.html`
- `xunit.xml`
- screenshotit
- selaimen trace/video, jos Browser Library on konfiguroitu niin

JUnit XML on CI:n yhteenvetoa varten. Robotin `log.html` on debuggausta varten — älä tyydy pelkkään "build failed" -näkymään. GitHub Actionsissa käytä `publish-unit-test-result`-actionia; GitLabissa `reports: junit:`.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#xunit-compatible-result-file)

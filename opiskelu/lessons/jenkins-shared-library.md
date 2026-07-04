# Useassa Jenkins-projektissa toistetaan samaa pipeline-logiikkaa. Miten vältetään kopiointi?

## Tilanne

20 repoa — jokaisessa kopioitu Jenkinsfile: checkout, Docker build, notify Slack. Muutos deploy-logiikkaan → 20 PR:ää. Drift: yksi repo jää vanhaan versioon.

## Ratkaisu

**Jenkins Shared Library** — organisaation Git-repo:

```groovy
@Library('company-pipeline@v2') _
pipeline {
    agent any
    stages {
        stage('Build') {
            steps { companyBuild() }
        }
    }
}
```

Library: `vars/companyBuild.groovy` — yksi paikka, versiointi tagilla (`@v2`).

## Käytännössä

Global Pipeline Libraries Jenkins-konfiguraatiossa. Testaa library muutos staging-jobilla ennen `@v2` bumpia. Dokumentoi public API (step-nimet, parametrit). Vaihtoehto: reusable workflow GitHub Actionsin `workflow_call`.

[Lue lisää](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)

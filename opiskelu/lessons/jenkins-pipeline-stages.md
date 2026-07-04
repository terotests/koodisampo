# Jenkins Declarative Pipelinessa build, test ja deploy tulisi ajaa peräkkäin. Mikä rakenne Jenkinsfilessä?

## Tilanne

Pipeline ajaa testit ennen buildia — deploy ennen testejä on käynyt läpi. Tarvitaan selkeä **vaiheiden järjestys**: build → test → deploy. Skripti yhdessä blookissa vaikeuttaa debuggausta — mikä vaihe failasi?

## Ratkaisu

**`stages`** Declarative Pipelinessa:

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps { sh 'npm run build' }
        }
        stage('Test') {
            steps { sh 'npm test' }
        }
        stage('Deploy') {
            when { branch 'main' }
            steps { sh './deploy.sh' }
        }
    }
}
```

Vaiheet ajetaan peräkkäin — edellinen fail → seuraava ei aja. `when` rajaa deployn branchiin.

## Käytännössä

`post { always { cleanWs() } }` cleanup. `parallel` nopeaan buildiin kun vaiheet riippumattomia. Blue Ocean / Stage view visualisoi. Dokumentoi Jenkinsfile PR:ssä.

[Lue lisää](https://www.jenkins.io/doc/book/pipeline/syntax/)

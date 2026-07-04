# Jenkins-pipeline pitää ajaa tietyllä agentilla jossa on Docker asennettuna. Miten määrität sen?

## Tilanne

Pipeline ajaa `docker build` — mutta oletusagentilla ei ole Dockeria. Build failaa: `docker: command not found`. Jenkins-agentit ovat labeleilla erotettuja (`linux`, `docker`, `windows`).

## Ratkaisu

**`agent { label 'docker' }`** Declarative Pipelinessa:

```groovy
pipeline {
    agent { label 'docker' }
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t myapp .'
            }
        }
    }
}
```

Jenkins kohdistaa jobin agentille, jolla on label `docker`.

## Käytännössä

Labelit määritellään node-konfiguraatiossa. `agent any` vain jos kaikilla agenteilla sama toolchain. Docker-in-Docker: mount socket tai Kaniko. Dokumentoi label-vaatimukset README:ssa.

[Lue lisää](https://www.jenkins.io/doc/book/pipeline/syntax/#agent)

# CI ajaa Robot-testit, mutta build menee vihreäksi vaikka testit epäonnistuivat. Mikä meni pieleen?

## Tilanne

CI-putki näyttää vihreää, mutta `log.html` kertoo että testejä epäonnistui. Kehittäjät luottavat build-statukseen ja mergeäävät rikkinäistä koodia. Ongelma on usein pipeline-skriptissä, ei Robotissa.

## Ratkaisu

**Pipeline nielee Robotin exit coden esim. `|| true` -rakenteella — älä peitä epäonnistumista.**

Huono:

```bash
robot tests/ || true
collect_artifacts.sh
```

Parempi:

```yaml
# GitHub Actions
- name: Run Robot tests
  run: robot --outputdir results tests/

- name: Upload artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: robot-results
    path: results/
```

Robot palauttaa ei-nollan exit coden epäonnistumisessa. Jos haluat jatkaa artefaktien keruuseen myös failin jälkeen, tee se CI:n `post`/`always`-vaiheessa — älä peittämällä testiajon epäonnistumista.

## Käytännössä

JUnit XML on CI:n yhteenvetoa varten, exit code on buildin onnistumisen ehto. Molemmat tarvitaan: XML kertoo *mitkä* testit epäonnistuivat, exit code kertoo *että* jotain meni pieleen.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#return-codes)

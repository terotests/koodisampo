# Mitä evaluator–optimizer-malli tarkoittaa?

## Ratkaisu

Yksi Building effective agents -kirjoituksen workflow-malleista (muut: prompt chaining, routing, parallelization, orchestrator-workers). Esim. käännös: generaattori kääntää, arvioija huomauttaa vivahteista, generaattori korjaa. Lopetusehto (laatukynnys tai kierrosraja) on pakollinen.

## Käytännössä

Arvioija voi olla myös deterministinen: kääntäjä, testit tai linter antavat usein parempaa palautetta kuin toinen malli.


[Lue lisää](https://www.anthropic.com/engineering/building-effective-agents)

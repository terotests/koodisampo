# Miksi agentille rakennetaan evaluaatiojoukko (evals) ennen promptien viilaamista?

## Ratkaisu

Eval = joukko tehtäviä ja arvioija, joka kertoo onnistuiko agentti. Hyvä lähtökohta on kerätä 20–50 todellista tapausta, erityisesti epäonnistumisia. Evalit tekevät malli- ja promptivaihdoista turvallisia ja nopeita.

## Käytännössä

Aloita pienesti ja käsin. Jokainen tuotannossa havaittu bugi on uusi eval-tapaus.


[Lue lisää](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

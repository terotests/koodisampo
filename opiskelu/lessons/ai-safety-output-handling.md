# Sovellus ajaa mallin generoiman SQL-kyselyn suoraan tuotantokantaan. Mikä on riski ja korjaus?

## Ratkaisu

Mallin tuottama SQL, HTML, shell-komento tai polku voi olla haitallinen joko virheen tai prompt injectionin takia. Samat periaatteet kuin käyttäjäsyötteessä: vähimmät oikeudet, parametrisointi, escapetus kontekstin mukaan ja allow-listat.

## Käytännössä

Anna text-to-SQL-agentille oma kantarooli, jolla on vain SELECT-oikeus ja statement_timeout.


[Lue lisää](https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/)

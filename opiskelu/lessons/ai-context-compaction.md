# Pitkä agenttisessio lähestyy kontekstiikkunan rajaa. Mitä compaction tarkoittaa?

## Ratkaisu

Compaction: kun konteksti täyttyy, malli (tai harness) kirjoittaa tiivistelmän tähänastisesta ja uusi konteksti alkaa siitä. Vaikein osa on valita mitä säilytetään: arkkitehtuuripäätökset, muutetut tiedostot ja keskeneräiset asiat kyllä, vanhat työkalutulokset ei.

## Käytännössä

Testaa tiivistyspromptia pitkillä transkripteilla. Liian aggressiivinen tiivistys hävittää hienovaraisia mutta tärkeitä yksityiskohtia.


[Lue lisää](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

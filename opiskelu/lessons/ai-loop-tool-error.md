# Työkalu kaatuu poikkeukseen (tiedostoa ei löydy). Miten harnessin kannattaa toimia?

## Ratkaisu

Työkaluvirheet ovat agentin arkea. Palauta `tool_result` kentällä `is_error: true` ja kirjoita virheteksti niin, että siitä näkee mitä tehdä seuraavaksi: 'Tiedostoa src/app.ts ei löydy. Lähin osuma: src/app.tsx'.

## Käytännössä

Hyvä virheviesti ohjaa: kerro mikä parametri oli väärin ja mikä olisi kelvollinen arvo. Pinojälki harvoin auttaa mallia.


[Lue lisää](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)

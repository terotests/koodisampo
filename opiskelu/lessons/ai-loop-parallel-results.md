# Malli pyysi samassa vastauksessa kahta työkalukutsua. Miten tulokset palautetaan?

## Ratkaisu

Rinnakkaiset työkalukutsut nopeuttavat agenttia (esim. kolme tiedostoa luetaan yhtä aikaa). Harness voi ajaa ne samanaikaisesti, mutta vastaus kootaan yhdeksi user-viestiksi, jossa on jokaiselle kutsulle `tool_result` samalla `tool_use_id`:llä.

## Käytännössä

Jos yksi kutsuista epäonnistuu, palauta silti sen tulos virheenä. Älä jätä paria puuttumaan.


[Lue lisää](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)

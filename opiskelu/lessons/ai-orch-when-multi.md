# Milloin moniagenttiarkkitehtuuri (orkestroija + rinnakkaiset työntekijät) kannattaa?

## Ratkaisu

Anthropicin tutkimusjärjestelmässä pääagentti suunnittelee ja käynnistää rinnakkaisia subagentteja, jotka tutkivat eri näkökulmia. Tulos parani selvästi laajoissa kysymyksissä, mutta tokenikulutus kasvoi moninkertaiseksi. Koodaus, jossa kaikki riippuu jaetusta tilasta, rinnakkaistuu huonommin.

## Käytännössä

Kokeile ensin yhtä agenttia. Siirry moniagenttiin vasta kun tehtävä jakautuu selvästi ja evalit näyttävät hyödyn.


[Lue lisää](https://www.anthropic.com/engineering/multi-agent-research-system)

# Miten työkalun parametrit määritellään Messages API:ssa, ja mitä harnessin pitää tehdä niille?

## Ratkaisu

Työkalu määritellään kolmella kentällä: `name`, `description` ja `input_schema` (JSON Schema). Skeema kertoo mallille rakenteen, mutta harnessin kannattaa silti validoida: tyypit, pakolliset kentät, sallitut arvot ja polkujen rajaus.

## Käytännössä

Käytä enum-kenttiä ja selkeitä nimiä (`user_id`, ei `id`). Epäselvät parametrinimet ovat yleinen virhekutsujen syy.


[Lue lisää](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)

# Mikä on agenttisilmukan (agent loop) perusrakenne?

## Ratkaisu

Silmukka: 1) lähetä historia + työkalumääritykset mallille, 2) jos vastauksessa on `tool_use`-lohkoja, aja ne, 3) lisää `tool_result`-lohkot historiaan ja palaa kohtaan 1. Kun malli vastaa ilman työkalukutsua (`stop_reason: end_turn`), kierros on valmis.

## Käytännössä

Pidä silmukka yksinkertaisena ja deterministisenä. Monimutkaisuus kuuluu työkaluihin ja kontekstin hallintaan, ei itse silmukkaan.


[Lue lisää](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)

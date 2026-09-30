# Harness striimaa mallin vastauksen. Milloin työkalukutsun voi suorittaa?

## Ratkaisu

Striimaus parantaa käyttökokemusta: teksti näkyy heti. Työkalukutsun syöte saapuu `input_json_delta`-paloina, jotka liitetään yhteen. Kun lohko päättyy, JSON jäsennetään ja validoidaan, ja vasta sitten työkalu ajetaan.

## Käytännössä

UI voi näyttää 'agentti kirjoittaa tiedostoa...' jo striimauksen aikana, mutta sivuvaikutukset tehdään vasta valmiilla syötteellä.


[Lue lisää](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)

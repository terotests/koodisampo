# Käytät LLM:ää arvioimaan agentin vastauksia (LLM-as-judge). Mikä parantaa luotettavuutta eniten?

## Ratkaisu

LLM-as-judge skaalautuu, missä ihmisarvio ei. Tunnettuja vinoumia ovat position bias (järjestys vaikuttaa), verbosity bias (pituus vaikuttaa) ja itsensä suosiminen. Kriteeristö, perustelujen pyytäminen ennen arvosanaa ja kalibrointi ihmisten merkintöihin vähentävät niitä.

## Käytännössä

Käytä deterministisiä tarkistuksia (testit, regex, skeema) aina kun voit, ja LLM-arvioijaa vain siihen, mitä koodilla ei voi mitata.


[Lue lisää](https://arxiv.org/abs/2306.05685)

# Minkä ominaisuuden klassinen Mercator-projektio säilyttää?

## Tilanne

Miksi vanhat merikartat käyttivät Mercatoria vaikka Grönlanti näyttää jättimäiseltä?

## Ratkaisu

**Mercator** on konforminen: suunnat/kulmat säilyvät, joten vakio kompassisuunta (loxodrome) on suora viiva. Hinta on mittakaavan kasvu napoja kohti — pinta-alat vääristyvät voimakkaasti.

## Käytännössä

Valitse projektio käyttötapauksen mukaan: navigointi/kulmat → konforminen; tilastokartat → equal-area; Suomi-GIS → TM35FIN.


[Lue lisää](https://proj.org/en/stable/operations/projections/merc.html)

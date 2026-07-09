# Uusi suositusalgoritmi rikkoo checkoutin osalle käyttäjistä. Miten pienennät riskiä etukäteen?

## Tilanne

Tiimi on kehittänyt uuden suositusalgoritmin checkout-sivulle. Testit menevät läpi, mutta tuotannossa algoritmi voi käyttäytyä eri tavalla oikealla datalla, eri käyttäjäsegmenteillä tai kuormituksessa. Jos julkaiset kaikille kerralla, osa käyttäjistä ei saa checkoutia valmiiksi.

Riskinhallinta ei tarkoita, etteikö uutta ominaisuutta julkaistaisi — vaan että vaikutus pysyy rajattuna ja peruttavissa.

## Ratkaisu

**Feature flag tai kill switch: julkaise pienelle joukolle ja sammuta ilman uutta deployta.**

Käytä feature flagia tai kill switchiä. Hyvä julkaisutapa:

- ominaisuus voidaan ottaa käyttöön pienelle joukolle
- sen voi sammuttaa ilman uutta deployta
- flagin tila näkyy lokeissa/metriikoissa
- flagit siivotaan pois, kun ominaisuus on vakiintunut

Feature flag ei korvaa testejä, mutta se tekee tuotantoriskistä hallittavamman. Sama periaate pätee riippumatta siitä, pyöriikö backend containerissa, VM:ssä vai serverless-funktiossa.

## Käytännössä

Aloita esim. 1 % käyttäjistä ja seuraa checkoutin error ratea ja latenssia erikseen flagin kanssa ja ilman. Jos ongelma ilmenee, sammuta flag heti — nopeampaa kuin rollback koko deploysta. Dokumentoi flagit ja poista ne, kun ominaisuus on vakiintunut (muuten koodi täyttyy kuolleista hauteista).

[Lue lisää](https://martinfowler.com/articles/feature-toggles.html)

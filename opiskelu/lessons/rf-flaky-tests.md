# Testi epäonnistuu kerran viikossa CI:ssä mutta menee aina rerunilla läpi. Mitä teet?

## Tilanne

Yksi testi epäonnistuu satunnaisesti yöajossa. Rerunilla se menee aina läpi. Tiimi lisää `Sleep 10s` tai ajaa testin kolme kertaa — luottamus koko testipakettiin heikkenee.

Flaky-testi on tuotanto-ongelma, ei pieni häiriö.

## Ratkaisu

**Kerää debug-artefaktit, selvitä juurisyy ja korjaa odotus/data/eristys — flaky-tag on väliaikainen.**

Parempi prosessi:

1. Kerää failista `log.html`, screenshot, network/console-lokit
2. Selvitä onko syy testissä, testidatassa, ympäristössä vai tuotteessa
3. Tee odotuksesta täsmällinen (ei `Sleep`, ei koko flow'n blind retry)
4. Eristä testi muista testeistä
5. Korjaa testidata
6. Jos pakko, merkitse väliaikaisesti `flaky`-tagilla ja tee tiketti

## Käytännössä

Huono vastaus: lisää `Sleep 10s`, aja testi aina kolme kertaa ja unohda asia, tai poista testi ilman selvitystä.

Rerun voi olla väliaikainen suojaverkko, ei pysyvä ratkaisu. Flaky-testi heikentää luottamusta koko testipakettiin — CI:n vihreä valo ei enää kerro totuutta.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#output-file)

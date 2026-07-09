# Deployn jälkeen virheprosentti nousee 0,1 % → 8 %. Mitä teet ensin?

## Tilanne

Uusi backend-versio julkaistiin 20 minuuttia sitten. Monitorointi näyttää, että `/api/orders` palauttaa paljon 500-virheitä. Osa käyttäjistä onnistuu, osa ei. Kehittäjä haluaisi alkaa heti debugata tuotannossa.

Virheprosentti nousi selvästi deployn jälkeen. Tämä on klassinen incident, jossa aika on kriittistä: jokainen minuutti tarkoittaa epäonnistuneita tilauksia ja asiakaspalvelukuormaa.

## Ratkaisu

**Pysäytä rollout ja rollbackaa edelliseen tunnetusti toimivaan versioon.**

Ensisijainen tavoite incidentissä on palauttaa palvelu, ei todistaa juurisyytä heti. Jos virhe alkoi deployn jälkeen ja vaikutus on merkittävä:

- pysäytä rollout
- rollbackaa edelliseen tunnetusti toimivaan versioon
- varmista, että error rate ja latency palautuvat
- kerää lokit, metriikat ja diffi juurisyyanalyysiä varten
- tee korjaus uutena muutoksena, älä debuggaa sokkona tuotannossa

Hyvä deploy on peruttavissa. Siksi versiot, migraatiot ja konfiguraatiomuutokset pitää suunnitella niin, että rollback on mahdollinen.

## Käytännössä

Varmista ennen deployta: onko edellinen versio vielä deployattavissa? Onko tietokantamigraatio taaksepäin yhteensopiva? Rollbackin jälkeen tee post-mortem: mikä muuttui, miksi testit eivät havainneet, miten estetään uudelleen. Feature flag voi olla vaihtoehto rollbackille, jos ongelma on yhdessä ominaisuudessa.

[Lue lisää](https://sre.google/sre-book/managing-incidents/)

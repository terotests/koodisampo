# Uusi ominaisuus: käyttäjä voi jakaa yksityisen raportin linkillä. Mitä uhkia mietit ennen toteutusta?

## Tilanne

Käyttäjä voi jakaa yksityisen raportin linkillä. Ennen toteutusta pitää miettiä, mitä suojataan, kuka hyökkää ja miten linkki voi vuotaa.

## Threat model

**Suojattava asia:**

- yksityinen raporttidata
- mahdolliset henkilötiedot / taloustiedot
- tieto siitä, että raportti on olemassa

**Mahdolliset hyökkääjät:**

- linkin arvaaja
- vastaanottaja, joka jakaa linkin eteenpäin
- henkilö, joka näkee linkin lokista, selaimen historiasta, Referer-headerista tai chatista
- entinen työntekijä, jonka pääsy pitäisi poistaa

**Suunnittelukysymykset:**

- Onko linkki bearer-token eli jokainen linkin haltija näkee raportin?
- Pitääkö linkin vaatia kirjautuminen?
- Voiko omistaja perua linkin?
- Onko linkillä voimassaoloaika?
- Rajataanko pääsy tiettyihin sähköposteihin tai käyttäjiin?
- Lokitetaanko avaaminen?
- Näkyykö token URL:ssa, lokeissa, analytiikassa tai Referer-headerissa?
- Saako raportin ladata/exportata?

## Väärä korjaus

"Riittää HTTPS — salausta ei voi murtaa" — HTTPS suojaa siirron, ei sitä että kuka tahansa linkin haltija näkee datan.

"Rate limit riittää — brute force estää tokenin arvaamisen" — rate limit auttaa, mutta ei korvaa token-suunnittelua, vanhenemista tai auditointia.

## Parempi korjaus — turvallinen oletus

- pitkä satunnainen token, esim. vähintään 128 bittiä entropiaa
- token tallennetaan hashattuna
- linkillä voimassaoloaika
- peruutusmahdollisuus
- audit-loki: kuka avasi raportin
- `Referrer-Policy: no-referrer` tai vähintään tiukka referrer policy
- ei indeksointia, ei public cachea
- harkitse kirjautumisvaatimusta, jos data on sensitiivistä

## Tuotantohuomiot

Threat modeling ennen koodausta — OWASP Insecure Design. Secure-by-design, ei jälkikorjaus. Jakolinkki on monimutkainen ominaisuus: token, vanheneminen, audit ja tietovuoto Refererissa pitää suunnitella yhdessä.

[Lue lisää](https://owasp.org/Top10/2021/A04_2021-Insecure_Design/)

# Raskas ORDER BY + hash join spillaavat levylle. Mikä istuntotason asetus auttaa ensin?

## Tilanne

Raskas analytiikkakysely yhdistää ORDER BY:n ja hash joinin. Molemmat voivat spillata levylle, jos muistiraja ylittyy — lokissa temporary file -viestit, `EXPLAIN` näyttää `Hash` ja `Sort` -solmut disk-spillillä. Kysely on toistuvasti hidas.

Ensimmäinen nopea toimenpide ennen kyselyn refaktorointia on nostaa sort/hash-operaatioiden muistikattoa **istuntotasolla**, jotta vaikutus rajoittuu yhteen raporttiin eikä koko instanssiin.

## Ratkaisu

**Kasvata work_mem harkiten — muisti per sort/hash-operaatio** on oikea istuntotason asetus.

```sql
SET work_mem = '256MB';  -- vain tämä session / raportti
-- raskas SELECT ... ORDER BY ... JOIN ...
RESET work_mem;
```

`work_mem` määrittää sort- ja hash-operaatioiden muistin per solmu. Hash join rakentaa hash-taulun muistiin; sort pitää ORDER BY -rivit muistissa — molemmat käyttävät `work_mem`:ia.

Varo globaalia nostoa: jokainen sort/hash voi kuluttaa `work_mem` verran, ja useita solmuja samassa kyselyssä voi olla useita. `work_mem × yhteydet × solmut` voi ylittää RAM:in.

## Taustaa

`shared_buffers` vaikuttaa page cacheen, ei sort/hash spilliin. `maintenance_work_mem` on maintenance-operaatioille.

Jos spill jatkuu korkeallakin `work_mem`:llä, optimoi kysely (indeksit, WHERE-rajaus, materialisoitu näkymä). Istuntotason `work_mem` on ensiapu, ei aina lopullinen ratkaisu.

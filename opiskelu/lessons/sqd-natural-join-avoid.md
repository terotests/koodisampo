# Tiimi käyttää NATURAL JOIN nopeuteen. Mikä riski?

## Tilanne

Nuori kehittäjä refaktoroi raportin "lyhyemmäksi":

```sql
SELECT *
FROM customers
NATURAL JOIN orders;
```

`NATURAL JOIN` yhdistää taulut automaattisesti sarakkeiden nimien perusteella — ei tarvitse kirjoittaa `ON`-ehtoa. Nopea kirjoittaa, vaikea ylläpitää.

Kuukausi myöhemmin migraatio lisää `updated_at`-sarakkeen molempiin tauluihin. NATURAL JOIN alkaa yhdistää myös `updated_at`-sarakkeiden perusteella — tai tuottaa odottamattoman cartesian-tyyppisen tuloksen, jos nimet eivät täsmää odotetusti. Schema-muutos voi yhdistää väärät sarakkeet hiljaa.

## Ratkaisu

**Eksplisiittinen ON on ylläpidettävämpi — vältä NATURAL JOIN tuotantokoodissa:**

```sql
SELECT c.id, c.name, o.order_id, o.total
FROM customers c
JOIN orders o ON o.customer_id = c.id;
```

Sarakkeet matchaavat nimellä NATURAL JOINissa — schema-muutos voi yhdistää väärät sarakkeet hiljaa. Eksplisiittinen ON dokumentoi liitoksen intentiota ja selviää refaktoroinnista.

Eksplisiittinen ON on ylläpidettävämpi — kirjan readability-teema.

## Käytännössä

Kiellä NATURAL JOIN ja USING(*) tiimin SQL style guidessa — ne piilottavat liitoksen logiikan.

Code reviewssa: jokainen JOIN tarvitsee näkyvän `ON`-ehdon. `USING (customer_id)` on kompromissi, mutta ON on selkeämpi usean sarakkeen liitoksissa.

Legacy-koodissa korvaa NATURAL JOIN eksplisiittisellä JOIN:illa heti kun kosketat tiedostoa — älä odota bugia.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

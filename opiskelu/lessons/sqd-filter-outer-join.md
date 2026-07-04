# LEFT JOIN orders, mutta haluat vain avoimet tilaukset — asiakkaat ilman avointa säilyvät. Missä ehto?

## Tilanne

Asiakasraportti näyttää kaikki asiakkaat ja heidän avoimen tilauksensa (jos on). Kehittäjä kirjoittaa:

```sql
SELECT c.id, c.name, o.order_id, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'open';
```

Ongelma: `WHERE o.status = 'open'` suodattaa pois rivit, joissa `o.*` on NULL — eli asiakkaat ilman yhtään tilausta katoavat. LEFT JOIN muuttuu käytännössä inner joiniksi. Asiakaspalvelu ei näe "ei koskaan tilannut" -asiakkaita.

## Ratkaisu

**`orders.status = 'open'` ON-ehdossa — ei WHERE:ssa, joka tiputtaa NULL-rivit:**

```sql
SELECT c.id, c.name, o.order_id, o.total
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.status = 'open';
```

ON-ehdossa status rajoittaa *matchia*, ei vasemman puolen rivien säilymistä. Asiakas ilman avointa tilausta näkyy yhden rivin `(NULL, NULL)` tilaussarakkeilla.

Suodatin oikealla puolella WHERE:ssa tiputtaa NULL-rivit pois — klassinen outer join -ansa.

## Käytännössä

Muista: `WHERE o.sarake = arvo` LEFT JOINin jälkeen = inner join -efekti. Siirrä oikean puolen ehdot ON:ään tai käytä `WHERE (o.status = 'open' OR o.status IS NULL)` vain jos logiikka vaatii.

Jos tarvitset sekä avoimet että suljetut eri sarakkeisiin, harkitse kahta LEFT JOINia eri aliaksilla — selkeämpi kuin monimutkainen OR-ehto.

Testaa aina: "Onko mukana rivejä, joilla oikea puoli on kokonaan NULL?" `count(*) WHERE o.order_id IS NULL` validoi outer join -käyttäytymisen.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

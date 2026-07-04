# Asiakkaat jotka eivät ole koskaan tilanneet. Malli?

## Tilanne

Markkinointi haluaa "ei koskaan ostanut" -segmentin uudelle asiakasalennukselle. Tarvitaan asiakkaat, joille `orders`-taulussa ei löydy yhtään riviä.

Kehittäjä kirjoittaa:

```sql
SELECT id, name, email
FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);
```

Jos `orders.customer_id` sisältää NULL-arvoja (kesken jääneet importit, vanha data), `NOT IN` palauttaa tyhjän joukon — SQL-logiikan kolmiarvoinen NULL tappaa koko tuloksen. Tämä on klassinen ansa.

Vaihtoehto LEFT JOIN + IS NULL toimii, mutta EXISTS on yleensä selkeämpi anti-join -kuvio.

## Ratkaisu

**`NOT EXISTS` — anti-join -kuvio:**

```sql
SELECT c.id, c.name, c.email
FROM customers c
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
);
```

NOT EXISTS on anti-join: "ei löydy yhtään matchia". Se käsittelee NULL:t oikein — toisin kuin `NOT IN`, joka epäonnistuu hiljaa NULL-arvojen kanssa.

NOT EXISTS on anti-join -kuvio; varo NOT IN + NULL -yhdistelmää.

## Käytännössä

Jos käytät LEFT JOIN -mallia:

```sql
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.customer_id IS NULL;
```

varmista, ettei `orders`-taulussa ole duplikaattirivejä samalle asiakkaalle ilman deduplikointia — EXISTS/NOT EXISTS on robustimpi.

Partial index `orders (customer_id)` riittää. Kampanja-ajossa aja `count(*)` ennen lähetystä — NOT IN NULL-bugi on tuottanut tyhjän segmentin tuotannossa useammin kuin uskoisi.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

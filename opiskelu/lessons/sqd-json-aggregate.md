# Rakenna JSON-array aggregoiduista riveistä raporttiin.

## Tilanne

API palauttaa raportin, jossa jokaisella asiakkaalla on lista tilauksista. Tietokannassa tilaukset ovat riveinä:

```sql
SELECT customer_id, order_id, total
FROM orders
WHERE customer_id = 42;
-- 42 | 101 | 29.90
-- 42 | 102 | 15.00
```

Sovellus odottaa yhtä JSON-dokumenttia asiakkaittain — taulukko tilauksista, ei useita SQL-rivejä. Tarvitset aggregoinnin, joka kokoaa rivit JSON-taulukoksi.

## Ratkaisu

PostgreSQLin **`json_agg`** tai **`jsonb_agg`** kokoaa arvot JSON-taulukoksi `GROUP BY`:n yhteydessä:

```sql
SELECT
  customer_id,
  json_agg(
    json_build_object('order_id', order_id, 'total', total)
    ORDER BY order_id
  ) AS orders
FROM orders
GROUP BY customer_id;
```

Vaihtoehto `row_to_json`: koko rivi objektiksi:

```sql
SELECT
  customer_id,
  jsonb_agg(to_jsonb(o) - 'customer_id' ORDER BY order_id) AS orders
FROM orders o
GROUP BY customer_id;
```

`jsonb_agg` palauttaa `jsonb`-tyypin (usein kätevämpi jatkokäsittelyyn). `ORDER BY` aggregaatissa määrää taulukon järjestyksen.

## Käytännössä

Rakenna API-vastaus suoraan SQL:llä — vähemmän round-trippejä ja yhtenäinen muoto. Suurilla joukoilla rajoita `LIMIT` alikyselyssä tai paginoi, ettei yksi `json_agg` kasva megatavuiksi.

`json_agg` palauttaa `null`, jos rivejä ei ole — käytä `COALESCE(json_agg(...), '[]'::json)` jos API vaatii tyhjän taulukon. Testaa muistinkulutus, kun aggregaatissa on tuhansia rivejä per ryhmä.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

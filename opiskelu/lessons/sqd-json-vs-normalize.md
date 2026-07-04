# API tallentaa koko vastauksen JSONB:hen. Milloin eriytät sarakkeet?

## Tilanne

Integraatio tallentaa ulkoisen API:n vastauksen sellaisenaan:

```sql
CREATE TABLE api_responses (
  id          bigserial PRIMARY KEY,
  payload     jsonb NOT NULL,
  received_at timestamptz DEFAULT now()
);

-- Esimerkki payload:
-- {"order_id": "ORD-99", "status": "shipped", "meta": {"source": "partner"}}
```

Aluksi kaikki haut menevät JSON-polkuja:

```sql
SELECT * FROM api_responses
WHERE payload->>'status' = 'shipped'
  AND (payload->'meta'->>'source') = 'partner';
```

Kun dataa kertyy ja näitä kyselyitä ajetaan jatkuvasti, seq scan + JSON-purku hidastuu. Indeksit ja JOINit eivät toimi yhtä luotettavasti kuin normaalilla sarakkeella.

## Ratkaisu

**Hybridimalli:** JSONB joustavuuteen, eriytetyt sarakkeet usein suodatettuihin kenttiin.

Kun kenttää suodatetaan, järjestetään tai indeksoidaan usein — normalisoi se omaksi sarakkeekseen:

```sql
ALTER TABLE api_responses
  ADD COLUMN status text GENERATED ALWAYS AS (payload->>'status') STORED,
  ADD COLUMN source text GENERATED ALWAYS AS (payload->'meta'->>'source') STORED;

CREATE INDEX ON api_responses (status);
CREATE INDEX ON api_responses (status, source);
```

Koko dokumentti säilyy `payload`-sarakkeessa harvoin tarvittaville kentille ja auditointiin. Kriittiset kyselypolut käyttävät sarakkeita.

## Käytännössä

Älä normalisoi kaikkea etukäteen — se hidastaa kehitystä. Seuraa `pg_stat_statements`: mitkä JSON-polut toistuvat? Kun sama polku näkyy top-listalla, eriytä se.

Säilytä JSONB, kun rakenne vaihtelee partnerien välillä tai kenttää luetaan harvoin. Eriytä, kun kenttä on osa WHERE/ORDER BY/JOIN-polkuja tai tarvitset foreign key -tyyppisen eheyden.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

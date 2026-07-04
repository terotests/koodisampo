# Sovellus ajaa saman SQL:n parametreilla miljoonia kertaa — parse overhead. Ratkaisu?

## Tilanne

ORM lähettää jokaisella kerralla uuden SQL-merkkijonon:

```sql
SELECT * FROM users WHERE id = 123;
SELECT * FROM users WHERE id = 124;
```

PostgreSQL joutuu parsimaan ja suunnittelemaan kyselyn uudelleen joka kerta. Miljoonilla kutsuilla parse + plan cache -kuorma dominoi, vaikka itse lookup olisi halpa index scan.

## Ratkaisu

**Prepared statements** — parse kerran, suorita monta kertaa parametreilla:

```sql
PREPARE user_by_id (int) AS
  SELECT * FROM users WHERE id = $1;

EXECUTE user_by_id(123);
EXECUTE user_by_id(124);
```

Sovelluskerroksessa (JDBC `PreparedStatement`, pg `query` parametreilla, SQLAlchemy `text()` + bind) sama periaate. Connection poolin kanssa varmista, että prepared plan säilyy (PgBouncer `transaction` vs `session` pool mode vaikuttaa).

Diagnostiikka: `pg_stat_statements` näyttää korkean `plans` vs `calls` suhteen ilman prepared statementeja.

## Taustaa

EXPLAIN ei näytä parse-aikaa erikseen tuotannossa — mutta `EXPLAIN (ANALYZE)` custom vs generic plan auttaa parametriherkkyydessä. Prepared statement ratkaisee parse-toistumisen.

[Lue lisää](https://www.postgresql.org/docs/current/sql-prepare.html)

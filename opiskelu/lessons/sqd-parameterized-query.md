# Käyttäjän syöte menee WHERE-ehtoon. Miten estät SQL-injektion?

## Tilanne

Web-sovellus hakee käyttäjän tilauksia ID:llä. Kehittäjä rakentaa kyselyn merkkijonoyhdistelyllä:

```javascript
// VAARALLINEN — älä tee näin
const sql = `SELECT * FROM orders WHERE user_id = '${req.query.id}'`;
```

Hyökkääjä lähettää `id=1 OR 1=1--` ja kysely muuttuu:

```sql
SELECT * FROM orders WHERE user_id = '1 OR 1=1--'
-- tai riippuen lainausmerkeistä: kaikkien rivien palautus
```

Käyttäjän syöte sekoittuu SQL-koodiin — klassinen **SQL-injektio**. OWASP listaa sen yhä yleiseksi haavoittuvuudeksi.

## Ratkaisu

**Parametrisoitu kysely** — erota koodi datasta. PostgreSQL käyttää paikkamerkkejä `$1`, `$2`:

```sql
-- Prepared statement (esim. node-pg)
SELECT * FROM orders WHERE user_id = $1;
-- Parametri: req.query.id arvona, ei osana merkkijonoa
```

Sovellus antaa arvon erikseen:

```javascript
await pool.query('SELECT * FROM orders WHERE user_id = $1', [req.query.id]);
```

Tietokanta käsittelee `$1`:n aina **arvona**, ei SQL-syntaksina — `'1 OR 1=1--'` ei koskaan muutu operaattoriksi.

## Käytännössä

Älä koskaan interpoloi käyttäjän syötettä SQL-merkkijonoon — ei edes "turvallisilta" näyttävissä paikoissa. ORM:t (Prisma, SQLAlchemy) parametrisoivat oletuksena, kun käytät niiden query API:a, ei raakaa string-SQL:ää.

Prepared statementit tarjoavat myös suunnitelman cachetuksen. `EXECUTE ... USING` PL/pgSQL:ssä noudattaa samaa periaatetta dynaamisissa funktioissa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

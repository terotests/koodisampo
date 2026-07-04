# Lista käyttäjistä haetaan yhdellä queryllä, mutta jokaiselle tehdään erillinen query profiiliin. Mikä ongelma?

## Tilanne

Admin-näkymässä listataan 500 käyttäjää. Backend tekee ensin yhden kyselyn:

```sql
SELECT id, name, email FROM users LIMIT 500;
```

Sitten sovellusloopissa jokaiselle riville haetaan profiili erikseen:

```sql
SELECT bio, avatar_url FROM profiles WHERE user_id = ?;
-- Toistetaan 500 kertaa
```

Yhteensä tietokantaan menee 501 kyselyä yhden sivulatauksen aikana. Kehitysympäristössä 50 ms × 500 tuntuu nopealta; tuotannossa latenssi kasvaa lineaarisesti käyttäjämäärän mukaan, connection pool tyhjenee ja API-timeoutit alkavat. PostgreSQLin `pg_stat_statements` näyttää saman `SELECT ... WHERE user_id = $1` -patternin tuhansia kertoja minuutissa.

Ongelma ei ole yksittäinen hidas query vaan **kyselymäärän räjähdys**: yksi lista × N riviä = N+1 kyselyä. Se on klassinen ORM-ansassa syntyvä bugi, joka jää helposti huomaamatta kun testidata on pieni.

## Ratkaisu

**N+1-query: profiili haetaan erikseen jokaiselle käyttäjäriville listauksessa.**

N+1 tarkoittaa: yksi query päädatalle + N queryä liitetylle datalle. Korjaus on hakea kaikki tarvittava kerralla — esimerkiksi JOINilla:

```sql
SELECT u.id, u.name, u.email, p.bio, p.avatar_url
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id
LIMIT 500;
```

Vaihtoehtoja: batch-haku (`WHERE user_id IN (...)`), GraphQL DataLoader tai ORM:n `select_related` / `include`. N+1 on klassinen backend-bugi — korjaa joinilla, batchilla tai dataloaderilla.

## Käytännössä

Ota käyttöön query-laskuri kehityksessä (Django Debug Toolbar, Hibernate statistics, Prisma query log). Code reviewissa listauksissa kysy: "Tehdäänkö tälle loopissa erillinen query?" Tuotannossa seuraa `calls`-lukua `pg_stat_statements`-näkymässä — toistuva yksinkertainen pattern on usein N+1-merkki.

[Lue lisää](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying)

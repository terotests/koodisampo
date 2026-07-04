# Sama taulu, käyttäjä näkee vain oman tiiminsä rivit. PostgreSQL-ominaisuus?

## Tilanne

SaaS-sovelluksessa kaikki asiakkaat jakavat saman `projects`-taulun:

```sql
SELECT * FROM projects;
-- id | team_id | name
--  1 |      10 | Alpha
--  2 |      20 | Beta
--  3 |      10 | Gamma
```

Sovellus lisää `WHERE team_id = ?` jokaiseen kyselyyn — mutta yksi unohtunut ehto tai uusi endpoint paljastaa toisen tiimin dataa. Turvallisuus riippuu sovelluskerroksen kurinalaisuudesta.

Tarvitset suodatuksen **tietokannassa**, joka pätee kaikille yhteyksille.

## Ratkaisu

**Row Level Security (RLS)** pakottaa rivisuodatuksen policyjen avulla:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY team_isolation ON projects
  FOR ALL
  USING (team_id = current_setting('app.current_team_id')::int);
```

Sovellus asettaa tiimin kontekstin yhteyden alussa:

```sql
SET app.current_team_id = '10';
SELECT * FROM projects;  -- vain team_id = 10
```

Policy `USING`-lauseke lisätään automaattisesti jokaiseen kyselyyn — sovellus ei voi "unohtaa" WHERE-ehtoa, ellei se käytä roolia, jolla on `BYPASSRLS`.

## Käytännössä

RLS on vahva kerros multi-tenant-arkkitehtuurissa. Yhdistä `SET LOCAL` transaktiossa, jotta arvo ei vuoda seuraavaan kyselyyn connection poolissa. Testaa policyt suoraan SQL:llä eri rooleilla.

Muista: RLS ei korvaa saraketason maskausta — erillinen näkymä tai policy voi tarvita arkaluontoisille kentille. `FORCE ROW LEVEL SECURITY` pakottaa policyt myös taulun omistajalle.

[Lue lisää](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

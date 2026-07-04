# Funktio kutsuu `now()` ilman schemaa. Miksi `SET search_path` on riski?

## Tilanne

Turvallisuuskriittinen funktio kirjaa aikaleiman:

```sql
CREATE FUNCTION audit.log_event(msg text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO audit.events (logged_at, message)
  VALUES (now(), msg);
END;
$$;
```

Funktio kutsuu `now()` ilman `pg_catalog`-etuliitettä. PostgreSQL etsii nimiä **`search_path`**-järjestyksessä — oletus `public` ensin. Hyökkääjä, jolla on oikeus luoda objekteja johonkin polun skeemaan, voi luoda oman `now()`-funktion:

```sql
CREATE SCHEMA evil;
CREATE FUNCTION evil.now() RETURNS timestamptz
  LANGUAGE sql AS $$ SELECT '1970-01-01'::timestamptz $$;

SET search_path = evil, public;
SELECT audit.log_event('test');  -- kutsuu evil.now(), ei pg_catalog.now()
```

Funktio suorittaa hyökkääjän koodia — **search path injection**.

## Ratkaisu

Kiinnitä `search_path` funktion luonnissa tai käytä schema-qualified nimiä:

```sql
CREATE FUNCTION audit.log_event(msg text)
RETURNS void
LANGUAGE plpgsql
SET search_path = audit, pg_catalog
AS $$
BEGIN
  INSERT INTO audit.events (logged_at, message)
  VALUES (pg_catalog.now(), msg);
END;
$$;
```

`SET search_path` funktion attribuutissa pakottaa turvallisen polun jokaisella kutsulla. `pg_catalog`-etuliite varmistaa oikean built-in-funktion.

## Käytännössä

Kaikki `SECURITY DEFINER` -funktiot vaativat kiinnitetyn `search_path`:in — ne suoritetaan omistajan oikeuksilla. `ALTER ROLE ... SET search_path` globaalisti on haurautta; parempi kiinnittää objektikohtaisesti.

Tarkista olemassa olevat funktiot:

```sql
SELECT proname, proconfig
FROM pg_proc
WHERE proconfig IS NOT NULL;
```

PostgreSQL-dokumentaatio suosittelee `search_path`-kiinnitystä kaikissa definer-funktioissa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

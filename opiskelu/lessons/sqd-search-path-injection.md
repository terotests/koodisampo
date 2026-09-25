# SECURITY DEFINER -funktio kutsuu `normalize_email()` ilman skeemaa, eikä funktiolle ole asetettu search_pathia. Mikä on riski?

## Tilanne

Rekisteröintifunktio ajetaan omistajansa oikeuksin (`SECURITY DEFINER`) ja normalisoi sähköpostin apufunktiolla:

```sql
CREATE FUNCTION app.register_user(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO app.users (email) VALUES (normalize_email(p_email));
END;
$$;
```

Funktio kutsuu `normalize_email()` ilman skeemaa. PostgreSQL etsii nimiä kutsujan **`search_path`**-järjestyksessä, eikä funktiolle ole kiinnitetty omaa polkua. Hyökkääjä, jolla on oikeus luoda objekteja johonkin skeemaan, voi luoda samannimisen funktion ja asettaa skeemansa polun alkuun:

```sql
CREATE SCHEMA evil;
CREATE FUNCTION evil.normalize_email(text) RETURNS text
  LANGUAGE sql AS $$ SELECT ... $$;  -- hyökkääjän koodi

SET search_path = evil, app, public;
SELECT app.register_user('x@example.com');  -- kutsuu evil.normalize_email() omistajan oikeuksin
```

Funktio suorittaa hyökkääjän koodia funktion omistajan oikeuksilla — **search path injection**.

Sisäänrakennetut funktiot, kuten `now()`, ovat `pg_catalog`-skeemassa, jota haetaan oletuksena ennen muita skeemoja. Niitä ei siksi voi kaapata näin, ellei `pg_catalog` ole erikseen sijoitettu polussa myöhemmäksi. Riski koskee omia funktioita, tauluja ja operaattoreita.

## Ratkaisu

Kiinnitä `search_path` funktion luonnissa tai käytä skeemalla määriteltyjä nimiä:

```sql
CREATE FUNCTION app.register_user(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = app, pg_temp
AS $$
BEGIN
  INSERT INTO app.users (email) VALUES (app.normalize_email(p_email));
END;
$$;
```

`SET search_path` funktion attribuutissa pakottaa turvallisen polun jokaisella kutsulla. `pg_temp` kannattaa sijoittaa viimeiseksi, jotta väliaikaisskeeman objektit eivät mene muiden edelle. Skeemalla määritelty nimi (`app.normalize_email`) varmistaa, että kutsutaan oikeaa funktiota.

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

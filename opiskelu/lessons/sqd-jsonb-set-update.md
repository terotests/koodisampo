# Päivitä yksi avain JSONB-dokumentissa ilman koko dokumentin korvaamista.

## Tilanne

Taulussa `tickets` on JSONB-sarake `payload`:

```sql
SELECT payload FROM tickets WHERE id = 1;
-- {"status": "open", "priority": "high", "comments": [...]}
```

Käyttäjä sulkee tiketin — haluat muuttaa vain `status`-avaimen arvoksi `"closed"`. Väärä tapa korvaa koko dokumentin sovelluskoodissa: lue JSON, muokkaa muistissa, kirjoita takaisin. Race condition ja datan menetys ovat riskinä, jos kaksi päivitystä osuu samaan riviin.

## Ratkaisu

PostgreSQLin **`jsonb_set`** päivittää yhden polun säilyttäen muun dokumentin:

```sql
UPDATE tickets
SET payload = jsonb_set(payload, '{status}', '"closed"')
WHERE id = 1;
```

Huomaa: uusi arvo on JSONB-literalina — merkkijono `"closed"` kirjoitetaan `'"closed"'`.

Useampi polku tai sisäkkäinen avain:

```sql
UPDATE tickets
SET payload = jsonb_set(payload, '{meta,updated_by}', '"system"')
WHERE id = 1;
```

Palauta päivitetty dokumentti RETURNINGilla:

```sql
UPDATE tickets
SET payload = jsonb_set(payload, '{status}', '"closed"')
WHERE id = 1
RETURNING payload;
```

## Käytännössä

`jsonb_set` on atomi tietokannassa — ei tarvitse lukea-kirjoittaa sovelluksessa. Jos avain puuttuu, se luodaan (oletus). Poistoon käytä `-` operaattoria: `payload - 'status'`.

Monimutkaisiin päivityksiin (`jsonb_set` ketjutettuna) harkitse `jsonb_build_object` + `||` -yhdistämistä tai sovelluskerroksen transaktiota — mutta yksittäinen avain on juuri `jsonb_set`-tehtävä.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

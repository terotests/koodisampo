# Varastosaldo luetaan sovellukseen, siitä vähennetään 1 ja arvo kirjoitetaan takaisin. Ruuhkassa saldo jää liian suureksi. Yksinkertaisin korjaus?

## Tilanne

Verkkokaupan varaus:

```python
qty = db.fetchval("SELECT qty FROM stock WHERE id = $1", item_id)
if qty > 0:
    db.execute("UPDATE stock SET qty = $1 WHERE id = $2", qty - 1, item_id)
```

Kampanjan aikana varasto myydään yli: saldo näyttää 5, vaikka tuotteita myytiin 20.

## Ratkaisu

Tee laskenta tietokannassa yhdellä atomisella lauseella:

```sql
UPDATE stock
SET qty = qty - 1
WHERE id = $1 AND qty > 0
RETURNING qty;
```

Jos lause ei päivitä yhtään riviä, tuote on loppu.

## Taustaa

Kun kaksi pyyntöä lukee saman saldon (5) ja kirjoittaa kumpikin arvon 4, toinen vähennys katoaa: tämä on **lost update**. `UPDATE ... SET qty = qty - 1` lukitsee rivin, joten rinnakkaiset päivitykset tehdään peräkkäin, ja jokainen näkee edellisen tuloksen. `qty > 0` estää saldon menemisen negatiiviseksi.

Jos logiikka ei mahdu yhteen lauseeseen, vaihtoehtoja ovat `SELECT ... FOR UPDATE` (pessimistinen lukitus), versiosarake (optimistinen lukitus) tai `SERIALIZABLE`-isolaatio uudelleenyrityksineen. `READ UNCOMMITTED` ei auta: PostgreSQL käsittelee sen kuten `READ COMMITTED`.

[Lue lisää](https://www.postgresql.org/docs/current/transaction-iso.html)

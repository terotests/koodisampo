# PostgreSQL varoittaa: 'database is not accepting commands to avoid wraparound'. Toimenpide?

## Tilanne

Kriittisin PostgreSQL-ylläpitotilanne: tietokanta **hylkää komennot** wraparound-suojauksen vuoksi. Vain VACUUM kelpaa. Palvelu on käytännössä alhaalla — välitön toimenpide vaaditaan.

## Ratkaisu

```sql
VACUUM FREEZE;
```

tai kohdistettu kriittisille tauluille. Varmista autovacuum ei ole pois päältä. Ennaltaehkäisy: reagoi aikaisempiin varoituksiin ("must be vacuumed within N transactions") — älä anna tilanteen eskaloida tähän.

Wraparound liittyy **transaction ID -kiertoon**, ei levytilaan.

## Taustaa

Tämä on harvinainen tuotantokatastrofi, jos autovacuum freeze toimii. Pitkät transaktiot + aggressiivinen insert voivat kiihdyttää.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)

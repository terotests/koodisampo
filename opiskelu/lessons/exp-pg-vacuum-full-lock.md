# Ops ehdottaa VACUUM FULL tuotantotaululle päivällä bloatin takia. Vastauksesi?

## Tilanne

Operaatiotiimi ehdottaa nopeaa bloat-korjausta `VACUUM FULL`:lla päiväsaikaan — levytila kriittinen, raportti johdolle huomenna. Paine tehdä "nopeasti" on suuri.

## Ratkaisu

Vastusta perustellusti: **VACUUM FULL = exclusive lock + rewrite** — tuotantokatko tunteja, riski kasvaa päiväsaian kuormalla.

Ehdota vaihtoehtoja:

- **pg_repack** yöllä (online, minimaalinen lock)
- Väliaikainen levytilan lisäys + normaali VACUUM (estää pahenemisen)
- Partition truncate vanhalle datalle jos arkkitehtuuri sallii

VACUUM FULL off-peak vain jos muut eivät riitä ja downtime hyväksytty.

## Taustaa

Expert-kysymys testaa tuotantoharkintaa — tekninen oikea vastaus vs operatiivinen paine.

[Lue lisää](https://www.postgresql.org/docs/current/sql-vacuum.html)

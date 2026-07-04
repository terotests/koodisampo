# DBA ehdottaa VACUUM FULL tuotantoon päivällä bloatin poistoon. Miksi ei?

## Tilanne

Bloat on mitattu — taulu 50 GB, live 10 GB. DBA ehdottaa `VACUUM FULL` päiväsaikaan nopeaan korjaukseen ennen levyrajan ylittymistä.

## Ratkaisu

**VACUUM FULL lukitsee taulun exclusive lockilla** koko rewrite-operaation ajaksi — tuotantokatko tunteja. Päiväsaian riskit:

- Sovellus timeoutit
- Jonot kasaavat
- Rollback vaikea kesken operaation

Suositus: **pg_repack** yöllä, blue-green cutover, tai partition swap. VACUUM FULL vain hätätilanteessa off-peak-aikana.

## Taustaa

Bloatin poisto ≠ normaali VACUUM. Shrink vaatii rewrite — hinta on lock.

[Lue lisää](https://www.postgresql.org/docs/current/sql-vacuum.html)

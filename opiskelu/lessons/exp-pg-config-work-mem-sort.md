# EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa?

**Ratkaisu:** `work_mem` (sama kuin [30]). Sort käyttää sitä ennen kuin kirjoittaa levylle.

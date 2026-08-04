# Levy näyttää täydeltä, mutta `du` ei löydä isoja tiedostoja. Mikä on todennäköisin syy?

## Tilanne

`df -h` näyttää 100 %, `du -xh /` ei selitä tilaa. Klassinen incident: loki tai datafile on **unlinkattu** (`rm` / logrotate) mutta prosessi pitää file descriptorin auki. Tila vapautuu vasta kun fd suljetaan (prosessi restart).

## Ratkaisu

Etsi deleted-but-open -tiedostot:

```bash
lsof +L1
# tai
lsof | grep deleted
```

Löydät pid/fd:n. Korjaus: restart/reload palvelu (tai sulje fd), jotta tila palaa. Estä toistuminen: logrotate `create` + signal, tai journald, älä `rm` avointa lokia käsin.

## Käytännössä

- `copytruncate` voi aiheuttaa samankaltaisia yllätyksiä (ks. `prod-linux-logrotate-copytruncate`).
- Kontissa: sama ilmiö volumeissa — tarkista konttiprosessin fd:t.
- Monitoroi `df` vs inode (`df -i`) erikseen.

[Lue lisää](https://man7.org/linux/man-pages/man8/lsof.8.html)

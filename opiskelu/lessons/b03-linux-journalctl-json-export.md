# SIEM tarvitsee journal-lokeja JSON-muodossa. Mikä journalctl-lippu?

## Tilanne

Turvallisuustiimi integroi palvelinlokit SIEM-järjestelmään. journalctl:n oletustuloste on ihmisluettavaa tekstiä:

```
Mar 15 10:23:01 web sshd[1234]: Failed password for root from 203.0.113.5
```

SIEM-parseri tarvitsee strukturoidun muodon — kentät erikseen (timestamp, unit, priority, message). Plain text aiheuttaa parsing-virheitä ja menettää metadataa.

## Ratkaisu

Käytä output-muotoa `-o`:

```bash
journalctl -o json
journalctl -o json-pretty
```

Esimerkki `json-pretty`-tulosteesta:

```json
{
  "__CURSOR": "s=abc123...",
  "__REALTIME_TIMESTAMP": "1710502981000123",
  "_SYSTEMD_UNIT": "sshd.service",
  "PRIORITY": "6",
  "MESSAGE": "Failed password for root from 203.0.113.5"
}
```

`-o json` tuottaa strukturoidun lokin — journalctl output formats.

Vienti tiedostoon:

```bash
journalctl --since today -o json > /var/log/export/journal-$(date +%F).json
journalctl -u nginx.service -o json-pretty --since "1 hour ago"
```

## Käytännössä

SIEM-integraatiossa `json` (ei pretty) on tehokkaampi — yksi JSON-objekti per rivi. Rajaa vienti ajan ja unitin mukaan ennen siirtoa: `journalctl -u sshd -o json --since yesterday`. Suurissa ympäristöissä harkitse `journalctl -f -o json` streamausta agentille reaaliaikaisesti.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)

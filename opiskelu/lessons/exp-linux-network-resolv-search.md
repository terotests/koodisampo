# Sisäinen palvelu `db.local` ei resolvdu mutta `db.local.corp` toimii. Mitä resolv.conf search-kenttä tekee?

## Tilanne

Mikropalvelu konfiguroitu yhdistämään hostiin `db.local`. Tuotannossa:

```bash
dig db.local.corp     # A-record OK
dig db.local          # NXDOMAIN
```

Kehitysympäristössä lyhyt nimi toimii. Ero on resolv.conf-asetuksissa — et muistanut, mitä `search`-rivi tekee.

## Ratkaisu

`/etc/resolv.conf`:

```
search corp
# tai: search local.corp
```

Kun sovellus kysyy `db.local`, resolver ei täydennä sitä — nimi on jo "tarpeeksi pitkä" tai se käsitellään absoluuttisena riippuen pisteestä.

Lyhyelle nimelle `db` resolver kokeilee:

```
db
db.corp
db.local.corp
```

**search-domainit lisätään lyhyille hostnameille DNS-kyselyihin.** Järjestys ja enintään kuusi domainia ovat tärkeitä (man resolv.conf).

Korjaus: käytä FQDN:ää `db.local.corp` konfiguraatiossa tai lisää oikea search-domain.

## Käytännössä

Search-lista aiheuttaa yllättäviä viiveitä, jos ensimmäiset domainit eivät vastaa — resolver yrittää niitä peräkkäin. Tuotannossa määrittele search eksplisiittisesti DHCP/NM:llä tai käytä täysiä nimiä. Konttien DNSPolicy (`ClusterFirst`) vaikuttaa samaan logiikkaan — tarkista aina podin resolv.conf.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

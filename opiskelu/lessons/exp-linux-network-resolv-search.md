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

```conf
search corp local.corp
options ndots:1
```

glibc:n oletus `ndots` on 1: jos nimessä on yksikin piste, nimi kokeillaan ensin absoluuttisena ennen search-listan lisäämistä.

Lyhyelle nimelle `db` resolver kokeilee käytännössä:

```text
db → db.corp, db.local.corp, db
```

Nimelle `db.local` (piste nimessä, `ndots:1`):

```text
db.local → db.local, db.local.corp
```

**search-domainit lisätään lyhyille hostnameille DNS-kyselyihin.** Jos search-listassa on vain `corp`, nimeä `db` ei täydennetä muotoon `db.local.corp` — siihen tarvitaan `local.corp` search-listassa.

Korjaus: käytä FQDN:ää `db.local.corp` konfiguraatiossa tai lisää oikea search-domain.

## Käytännössä

Search-lista aiheuttaa yllättäviä viiveitä, jos ensimmäiset domainit eivät vastaa — resolver yrittää niitä peräkkäin. Tuotannossa määrittele search eksplisiittisesti DHCP/NM:llä tai käytä täysiä nimiä. Konttien DNSPolicy (`ClusterFirst`) vaikuttaa samaan logiikkaan — tarkista aina podin resolv.conf.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

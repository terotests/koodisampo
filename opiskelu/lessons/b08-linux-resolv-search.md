# Lyhyt hostname 'db' ei resolvdu — FQDN toimii. Mitä /etc/resolv.conf search-kenttä tekee?

## Tilanne

CI-runnerissa testit epäonnistuvat:

```bash
psql -h db -U app
# could not translate host name "db" to address
psql -h db.corp.local -U app
# toimii
```

Kehityskoneella lyhyt nimi toimii — ero on resolver-asetuksissa.

## Ratkaisu

`/etc/resolv.conf`:

```
search corp.local internal.corp
```

**search lisää domain-suffiksia lyhyille nimille — järjestys tärkeä.** Resolver kokeilee:

1. `db` (absoluuttinen jos päättyy pisteeseen)
2. `db.corp.local`
3. `db.internal.corp`

Ilman search-riviä vain FQDN toimii.

## Käytännössä

Enintään kuusi domainia search-listassa. Väärä järjestys aiheuttaa hitaita timeoutteja ennen oikeaa osumaa. CI/CD-imageissa määrittele search eksplisiittisesti tai käytä FQDN:ää pipeline-konfigissa — se on luotettavampaa kuin olettaa hostin DNS. systemd-resolved: `resolvectl domain`.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

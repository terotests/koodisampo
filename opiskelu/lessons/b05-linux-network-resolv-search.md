# Sisäinen hostname `app.internal` ei resolvdu mutta FQDN toimii. Mikä resolv.conf-asetus auttaa?

## Tilanne

Kubernetes-manifestissa service name on `app`, mutta ulkopuolelta klusteria tarvitaan `app.internal.corp`. Kehityskoneella konfigissa lukee lyhyt nimi:

```yaml
database_host: db
```

`db` ei resolvdu, mutta `db.internal.corp` toimii.

## Ratkaisu

Lisää `/etc/resolv.conf`:iin:

```
search internal
```

tai laajempi:

```
search internal corp
```

**search internal — lyhyet nimet kokeillaan search-domaineissa.** Resolver yrittää `db` → `db.internal` → `db.corp` (järjestyksessä).

Vaihtoehto: käytä aina FQDN konfiguraatiossa.

## Käytännössä

Search-listan pituus ja järjestys vaikuttavat sekä onnistumiseen että viiveeseen. DHCP/NM voi ylikirjoittaa resolv.conf:in bootissa — tee muutos pysyväksi NM-profiiliin (`ipv4.dns-search`) tai systemd-resolved drop-iniin. Tuotantokonttien DNSPolicy määrittää search-domainit erikseen — älä oleta hostin asetuksia.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

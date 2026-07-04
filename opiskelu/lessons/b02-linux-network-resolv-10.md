# Lyhyet hostnamet eivät resolvdu — FQDN toimii. Mikä tiedosto?

## Tilanne

Skripti kutsuu `http://api/` ja saa DNS-virheen. Sama endpoint FQDN:llä toimii:

```bash
curl http://api.internal.corp/health   # 200 OK
curl http://api/health                 # Could not resolve host
```

Ongelma ei ole palomuurissa vaan nimien täydentämisessä.

## Ratkaisu

Tarkista **`/etc/resolv.conf`** — erityisesti `search` tai `domain`:

```bash
grep -E '^(search|domain|nameserver)' /etc/resolv.conf
```

systemd-resolved -järjestelmissä:

```bash
resolvectl status
ls -l /etc/resolv.conf   # usein symlink stub-resolveriin
```

**search lisää domain-suffixin** lyhyille nimille. Ilman sitä `api` lähtee resolverille sellaisenaan.

## Käytännössä

NetworkManager ja DHCP voivat ylikirjoittaa resolv.conf:in — pysyvä fix tehdään NM-profiiliin tai `systemd-resolved` drop-in -tiedostoon. Koodissa ja konfigeissa suosi FQDN:ää; search on mukavuus, ei sopimus eri ympäristöjen välillä.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

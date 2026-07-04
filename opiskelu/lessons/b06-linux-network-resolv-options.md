# DNS-haku hidastuu — haluat rajoittaa retry ja timeout. Missä konfiguroit?

## Tilanne

Sovelluksen käynnistys kestää minuutteja, koska jokainen DNS-kysely yrittää useita kertoja ennen kuin siirtyy seuraavaan nameserveriin. Resolverin oletusarvot ovat liian löysät hajautetussa ympäristössä.

```bash
time getent hosts slow-internal.service
# real 0m8.000s
```

## Ratkaisu

`/etc/resolv.conf`:

```
nameserver 10.0.0.53
options timeout:1 attempts:2
```

- `timeout:1` — sekuntia per yritys
- `attempts:2` — yrityskertoja per nameserver

systemd-resolvedissa vastaavat asetukset `/etc/systemd/resolved.conf`:

```ini
[Resolve]
DNS=10.0.0.53
FallbackDNS=
```

**options timeout:1 attempts:2 resolv.conf:ssa tai stub resolverissa.**

## Käytännössä

Liian aggressiivinen timeout voi aiheuttaa flaky-käyttäytymistä hitaissa verkoissa — testaa ennen tuotantoon viemistä. Korjaa juurisyy (väärä search-domain, kuollut nameserver) timeoutin sijaan jos mahdollista. Sovellustasolla connection timeout DNS:stä erillään auttaa erottamaan resolver- ja palveluongelmat.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

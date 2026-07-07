# DNS-haku hidastuu — haluat rajoittaa retry ja timeout. Missä konfiguroit?

## Tilanne

Sovelluksen käynnistys kestää minuutteja, koska jokainen DNS-kysely yrittää useita kertoja ennen kuin siirtyy seuraavaan nameserveriin. Resolverin oletusarvot ovat liian löysät hajautetussa ympäristössä.

```bash
time getent hosts slow-internal.service
# real 0m8.000s
```

## Ratkaisu

Perinteinen glibc-resolver `/etc/resolv.conf`:

```
nameserver 10.0.0.53
options timeout:1 attempts:2
```

- `timeout:1` — sekuntia per yritys
- `attempts:2` — yrityskertoja per nameserver

**systemd-resolved** -distroilla `/etc/resolv.conf` on usein stub-symlink (`127.0.0.53`). Pysyvä muutos tehdään NetworkManageriin tai `systemd-resolved`-konfigiin:

```ini
# /etc/systemd/resolved.conf.d/dns.conf
[Resolve]
DNS=10.0.0.53
FallbackDNS=
```

`options timeout:1 attempts:2` resolv.conf:ssa ei välttämättä ratkaise samaa asiaa systemd-resolved-ympäristössä kuin suora glibc-resolverissa.

## Käytännössä

Liian aggressiivinen timeout voi aiheuttaa flaky-käyttäytymistä hitaissa verkoissa — testaa ennen tuotantoon viemistä. Korjaa juurisyy (väärä search-domain, kuollut nameserver) timeoutin sijaan jos mahdollista. Tarkista `resolvectl status` ennen kuin editoit stub-resolv.conf:ia käsin.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

# Legacy-sovellus hajoaa IPv6-osoitteeseen DNS:ssä — kontissa toimii IPv4-only hostilla. Diagnostiikka?

## Tilanne

Legacy Java-sovellus kontissa yrittää yhdistää `legacy-api.company.com`:iin. Hostilla (IPv4-only) kaikki toimii. Kontissa:

```
Connection refused: legacy-api.company.com/2001:db8::1:443
```

DNS palauttaa sekä A- että AAAA-tietueen. Sovellus yrittää IPv6:ta ensin (`getaddrinfo` happy eyeballs), mutta Docker-verkko tai sovellus ei tue IPv6:ta kunnolla.

## Ratkaisu

Tarkista **`docker network inspect`**, **`/etc/hosts`** ja **`getaddrinfo`** — dual stack vs ipv4-only. Docker networking voi tarjota IPv6 — sovellus voi yrittää AAAA ensin.

Diagnostiikka:

```bash
docker exec myapp getent ahosts legacy-api.company.com
docker exec myapp cat /etc/hosts
docker exec myapp cat /etc/gai.conf
docker network inspect mynet | jq '.[0].EnableIPv6'
```

Korjaukset:

```yaml
# Compose — pakota IPv4 DNS-vastauksia
services:
  myapp:
    environment:
      JAVA_TOOL_OPTIONS: "-Djava.net.preferIPv4Stack=true"
```

Tai poista IPv6 verkosta:

```yaml
networks:
  mynet:
    enable_ipv6: false
```

## Käytännössä

Dual-stack-verkoissa testaa sovellus sekä IPv4- että IPv6-only DNS-vastauksilla. Legacy-sovelluksille `gai.conf` precedence IPv4:lle (`precedence ::ffff:0:0/96 100`) voi auttaa konttitasolla. Dokumentoi vaatimus compose-tiedostoon.

[Lue lisää](https://docs.docker.com/config/daemon/ipv6/)

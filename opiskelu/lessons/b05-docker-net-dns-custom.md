# Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjaus?

## Tilanne

Compose-palvelu tarvitsee Active Directory -DNS:n:

```yaml
services:
  app:
    image: myapp:latest
    environment:
      LDAP_SERVER: ldap.corp.example.com
```

Kontissa:

```
Error: getaddrinfo ENOTFOUND ldap.corp.example.com
```

Host resolvaa nimen oikein (`dig ldap.corp.example.com`), mutta kontti käyttää Dockerin embedded DNS:ää, joka ei tunne corp-zonea.

## Ratkaisu

**`dns:`-asetus palvelulle tai network-level DNS.** Configure container DNS — Compose-korjaus:

```yaml
services:
  app:
    image: myapp:latest
    dns:
      - 10.0.0.53
      - 10.0.0.54
    dns_search:
      - corp.example.com
    environment:
      LDAP_SERVER: ldap.corp.example.com
```

Testaa:

```bash
docker compose exec app nslookup ldap.corp.example.com
```

## Käytännössä

`dns_search` lyhentää FQDN-kutsuja (`ldap` → `ldap.corp.example.com`). VPN-ympäristöissä varmista, että corporate nameserver on tavoitettavissa kontista (firewall-säännöt host → DNS). Älä sekoita `extra_hosts`-kiinteitä merkintöjä ja oikeaa DNS:ää — käytä DNS:ää dynaamisille palveluille.

[Lue lisää](https://docs.docker.com/config/containers/container-networking/#dns-services)

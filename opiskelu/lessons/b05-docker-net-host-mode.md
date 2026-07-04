# Latency-kriittinen palvelu tarvitsee suoran pääsyn host-portteihin ilman NAT:ia. Verkko-mode?

## Tilanne

Metrics-agentti kerää hostin verkkoliikennettä ja raportoi UDP:llä. Port mapping aiheuttaa ylimääräisen kerroksen:

```yaml
services:
  metrics:
    image: metrics-agent:latest
    ports:
      - "8125:8125/udp"
```

Profiilissa DNAT-kustannus on merkittävä, ja agentti tarvitsee suoran pääsyn hostin UDP-portteihin ilman bridge-NAT:ia.

## Ratkaisu

**`network_mode: host`** — kontti jakaa hostin network stackin. Host mode poistaa port mapping -overheadin.

```yaml
services:
  metrics:
    image: metrics-agent:latest
    network_mode: host
```

Kontti sitoo portin 8125 suoraan hostin stackiin. Ei `ports:`-osiota.

```bash
docker run -d --network host metrics-agent:latest
```

## Käytännössä

Host-mode on Linux-spesifinen ratkaisu. Kontti menettää verkkorajauksen — harkitse security implications ennen tuotantokäyttöä. Vain yksi prosessi voi sitoa tietyn portin hostilla; varmista ettei host-palvelu ole ristiriidassa.

[Lue lisää](https://docs.docker.com/engine/network/drivers/host/)

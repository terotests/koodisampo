# Low-latency palvelu tarvitsee suoran host-portin ilman NAT:ia. Verkko-optio?

## Tilanne

HFT-tyyppinen tai reaaliaikainen palvelu kuuntelee UDP/TCP-porttia 9000. Bridge + port mapping (`-p 9000:9000`) aiheuttaa mitattavaa latenssia ja DNAT-overheadia. Profiloinnissa näkyy ylimääräinen verkko-kerros iptables-sääntöjen kautta.

```bash
docker run -d -p 9000:9000 mylowlatency:latest
# Latenssi ~10µs enemmän kuin natiivi prosessi
```

Palvelu tarvitsee suoran pääsyn hostin verkkopinoon ilman NAT:ia.

## Ratkaisu

**`--network host`** jakaa kontin verkkopinon hostin kanssa Linuxissa. host network poistaa NAT overhead.

```bash
docker run -d --network host mylowlatency:latest
```

Kontti sitoo portin 9000 suoraan hostin stackiin — ei `-p`-määritystä. Liikenne kulkee ilman bridge-NAT:ia.

Compose:

```yaml
services:
  trader:
    image: mylowlatency:latest
    network_mode: host
```

## Käytännössä

Host-mode heikentää eristystä — kontti näkee kaikki hostin portit. Käytä vain Linuxilla (Docker Desktop/macOS/Windows rajoittaa host-moodia). Tuotannossa harkitse myös `macvlan` jos tarvit erillisen IP:n mutta ilman NAT:ia.

[Lue lisää](https://docs.docker.com/network/drivers/host/)

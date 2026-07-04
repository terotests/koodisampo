# Muistivuoto täyttää koko palvelimen — haluat rajoittaa yhden unitin RAM-käytön. Mitä lisäät unit-tiedostoon?

## Tilanne

`cache.service` vuotaa muistia hitaasti. Ilman rajaa se kuluttaa kaiken RAM:in ja OOM-killer alkaa tappaa muita prosesseja — mukaan lukien tietokanta.

```bash
free -h
# Mem: 62Gi used — cache.service 58Gi
dmesg | grep oom-killer
```

Tarvitaan cgroup-pohjainen raja yhdelle unitille ilman koko palvelimen uudelleenkäynnistystä.

## Ratkaisu

Lisää unit-tiedostoon **`MemoryMax=`** tai **`MemoryHigh=`** — **cgroup-raja systemd unitissa**.

```ini
[Service]
ExecStart=/usr/bin/cache
MemoryMax=2G
MemoryHigh=1536M
```

- **`MemoryHigh=`** — throttle (paine muistille, hidastaa allokaatioita)
- **`MemoryMax=`** — kova katto (prosessi tapetaan ylityksessä)

```bash
sudo systemctl daemon-reload
sudo systemctl restart cache.service
systemctl show cache -p MemoryCurrent -p MemoryMax
```

**systemd resource control — MemoryMax kill, MemoryHigh throttle.**

## Käytännössä

Aseta raja alle palvelimen fyysisen RAM:in — jätä tilaa kernelille ja kriittisille palveluille. `MemoryMax` suojaa naapureita; se ei korjaa vuotoa — korjaa koodi.

Yhdistä monitorointiin: cgroup-metriikat Prometheus-node-exporterilla. Testaa raja stagingissa — liian matala aiheuttaa false positive -OOM:eja.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html)

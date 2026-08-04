# Docker-kontin muistiraja on 512M, mutta haluat nähdä saman cgroup v2 -tasolla hostilla. Mistä lukema?

## Tilanne

`docker stats` näyttää muistia, mutta incidentissä haluat nähdä saman rajan/käytön **hostin cgroup-hierarkiasta** (systemd slice, containerd, rootless). Epäily: Docker UI ja kernel eivät täsmää.

## Ratkaisu

cgroup v2:

```bash
systemd-cgtop
# tai suoraan:
cat /sys/fs/cgroup/system.slice/docker-<id>.scope/memory.current
cat /sys/fs/cgroup/system.slice/docker-<id>.scope/memory.max
```

`memory.current` = käyttö, `memory.max` = raja (`max` = rajaton). Polku vaihtelee runtime/orchestratorin mukaan (`containerd`, Kubepods, user.slice rootlessissa).

## Käytännössä

- `docker inspect` / `crictl` auttavat löytämään cgroup-polun.
- OOM: katso `memory.events` ja dmesg/`journalctl -k`.
- Ymmärrä hierarchical limits: parent slice voi kuristaa lasta lisää.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html)

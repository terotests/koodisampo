# API on hidas mutta CPU ei ole lähelläkään 100 %. Mistä näet onko pullonkaula levy-IO:ssa?

## Tilanne

Latency nousee, `top` näyttää idle CPU:ta. Epäily: lukot, verkko tai **levy-IO**. Ilman IO-metriikkaa tiimi optimoi väärää kerrosta (lisää podja, kun levy on saturated).

## Ratkaisu

Mittaa IO erikseen:

```bash
iostat -xz 1
pidstat -d 1
vmstat 1
```

`iostat`: laitteen `%util`, `await`, `aqu-sz`. `pidstat -d`: prosessikohtaiset read/write. Korkea await + korkea util → levy on pullonkaula. CPU idle + prosessit `D`-tilassa (uninterruptible sleep) vihjaa IO-odotuksesta.

## Käytännössä

- Katso myös `biotop`/`iotop` jos saatavilla.
- Konttiympäristössä: hostin IO + cgroup limits (`io.max`).
- Korrelaatio: hitaat DB-queryt vs levy vs verkko — erottele työkaluilla, älä arvaa.

[Lue lisää](https://man7.org/linux/man-pages/man1/iostat.1.html)

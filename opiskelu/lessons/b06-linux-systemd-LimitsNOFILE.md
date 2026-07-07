# Palvelu saa 'too many open files' tuotannossa. Miten nostat rajan systemd-unitissa?

## Tilanne

High-traffic API saa lokiviestin:

```
accept: Too many open files
```

Login-shellissa `ulimit -n` näyttää 65535, mutta palvelu pyörii systemd-unitin alla erillisillä rajoilla. Oletus `LimitNOFILE` systemd-palveluille on usein 1024 — riittämätön tuhansille samanaikaisille yhteyksille.

## Ratkaisu

Aseta **`LimitNOFILE=65535`** drop-in-tiedostossa — älä editoi vendor-unitia suoraan:

```bash
sudo systemctl edit api.service
```

```ini
[Service]
LimitNOFILE=65535
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart api.service
```

Varmista prosessin raja:

```bash
PID=$(systemctl show api -p MainPID --value)
cat /proc/$PID/limits | grep "open files"
```

**Resource limits in unit — systemd.resource-control LimitNOFILE.**

## Käytännössä

Nosta myös kernel-parametri `fs.file-max` tarvittaessa. `LimitNOFILE=soft:hard` -syntaksi erottaa soft/hard limitit.

Älä kopioi `infinity` tuotantoon ilman harkintaa — memory leak + unlimited fd = koko palvelin alhaalla. Monitoroi avointen fd:iden määrää (`lsof -p $PID | wc -l`).

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html#LimitNOFILE=)

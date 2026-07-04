# High-traffic palvelu saa Too many open files — ulimit ok login-shellissa. Missä korjaat systemd-palvelulle?

## Tilanne

Operaattori testaa palvelimella:

```bash
ulimit -n
65535
```

Mutta `proxy.service` kaatuu tuotannossa:

```
accept4: Too many open files (errno 24)
```

Shellin ulimit ei vaikuta systemd:n hallitsemiin prosesseihin — ne saavat omat resurssirajansa unit-tiedostosta tai oletuksista (usein 1024 avointa tiedostoa).

## Ratkaisu

Korjaa **`LimitNOFILE=` service unitissa** — **systemd asettaa rajat prosessille**.

Drop-in:

```bash
sudo systemctl edit proxy.service
```

```ini
[Service]
LimitNOFILE=65535
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart proxy.service
```

Varmista:

```bash
MAINPID=$(systemctl show proxy -p MainPID --value)
grep "Max open files" /proc/$MAINPID/limits
```

**systemd unit directives override defaults — LimitNOFILE.**

## Käytännössä

Älä nosta rajaa sokeasti — selvitä miksi fd:t kertyvät (connection leak, socket close puuttuu). `LimitNOFILE` on palliatiivi, ei korjaus.

Sama pattern muille rajoille: `LimitNPROC=`, `MemoryMax=`. Login-shellin `ulimit` on harhaanjohtava debug-työkalu systemd-palveluille.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#LimitNOFILE=)

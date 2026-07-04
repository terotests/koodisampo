# Portti 8080 on jo käytössä deploy epäonnistuu. Mikä komento näyttää mikä prosessi kuuntelee?

## Tilanne

Blue-green deploy vaihtaa uuden version porttiin 8080. Uusi kontti kaatuu heti:

```
Error: listen tcp :8080: bind: address already in use
```

Vanha versio piti jo sammua, mutta jokin prosessi pitää porttia yhä kiinni. Et näe konttien sisältä hostin prosesseja suoraan.

## Ratkaisu

Hostilla:

```bash
ss -tlnp | grep 8080
```

TCP-kuuntelijat: `-tlnp`. UDP-kuuntelijalle:

```bash
ss -ulnp | grep 8080
```

**ss -tlnp näyttää TCP-kuuntelijat ja prosessin — moderni netstat-korvike.**

Kun prosessi on tunnistettu:

```bash
kill -TERM <pid>
# tai systemd: systemctl stop vanha-palvelu
```

## Käytännössä

Deploy-skripteihin kannattaa lisätä pre-flight -tarkistus: jos portti varattu, näytä `ss`-tuloste lokissa. Kubernetesissa `hostPort` tai vanha DaemonSet voi varata saman portin — tarkista myös `kubectl get pods -o wide`. Älä käytä `kill -9` ensimmäisenä; anna prosessille aikaa vapauttaa socket gracefully.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)

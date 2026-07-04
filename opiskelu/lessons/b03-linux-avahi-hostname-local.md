# Kehityskone hostaa API:n osoitteessa devbox.local — toinen kone ei resolvaa. Tarkista?

## Tilanne

Kehityskone A hostaa REST API:n ja ilmoittaa itsensä nimellä `devbox.local`. Kehityskone B yrittää yhdistää:

```bash
curl http://devbox.local:8080/api/v1/status
# curl: (6) Could not resolve host: devbox.local
ping devbox.local
# ping: devbox.local: Name or service not known
```

Kone A:lla `avahi-browse -a` näyttää palvelun, mutta kone B ei resolvaa `.local`-nimeä ollenkaan. Molemmat ovat samassa WiFi-verkossa.

## Ratkaisu

Tarkista koneella B:

**1. Avahi daemon käynnissä:**

```bash
systemctl status avahi-daemon
sudo systemctl enable --now avahi-daemon
```

**2. NSS-mdns integraatio asennettu** (`libnss-mdns` / `nss-mdns`):

```bash
# /etc/nsswitch.conf — hosts-rivillä pitää olla mdns:
grep hosts /etc/nsswitch.conf
# hosts: files mdns4_minimal [NOTFOUND=return] dns
```

Asenna puuttuva paketti:

```bash
sudo apt install libnss-mdns avahi-daemon
```

mDNS `.local`-nimet vaativat avahi + NSS-integraation — pelkkä DNS-resolveri ei riitä.

Testaa:

```bash
avahi-resolve -n devbox.local
getent hosts devbox.local
```

## Käytännössä

`mdns4_minimal` resolvaa vain `*.local`-nimet (suositeltu). `mdns4` resolvaa kaiken mDNS:n kautta, mikä voi hidastaa lookuppeja. Docker- ja VPN-verkot voivat estää multicastin — erillinen ongelma.

[Lue lisää](https://www.avahi.org/docs/)

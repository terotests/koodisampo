# Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode?

## Tilanne

DNS-resolver tai bind-kontti pitää kuunnella porttia 53 host-verkossa. Bridge-moodissa port mapping (`-p 53:53`) toimii usein, mutta jotkut työkalut odottavat, että palvelu on **suoraan** hostin osoitteessa ilman DNAT-kerrosta — esim. paikallinen resolver, systemd-resolved-integraatio tai privileged DNS-tapaus.

NAT ja port mapping lisäävät kerroksen, joka rikkoo oletuksia "kuuntelen 0.0.0.0:53 hostilla".

## Ratkaisu

```yaml
services:
  dns:
    network_mode: host
```

Kontti jakaa hostin verkkonimiavaruuden — kuuntelu portissa 53 on hostin portti 53, ei mapattu bridge-portti. Ei erillistä `-p 53:53/udp` -määritystä.

## Huomio

Host-mode tarkoittaa: vain yksi prosessi voi sitoa portin 53 hostilla. Varmista ettei hostin `systemd-resolved` tai muu DNS ole ristiriidassa. Tuotannossa harkitse erillinen DNS-infrastruktuuri ennen host-moodin oletuskäyttöä.

[Lue lisää](https://docs.docker.com/network/drivers/host/)

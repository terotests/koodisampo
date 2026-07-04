# Palvelin ei pääse ulos verkon 10.0.0.0/8 ulkopuolelle, mutta pingaa gatewayn. Mikä todennäköisin puuttuu?

**Ratkaisu:** **oletusreitti (default route)** internetiin. Paikallinen verkko ja gateway toimivat, mutta `0.0.0.0/0` puuttuu routing tablesta.

```bash
ip route add default via 10.0.0.1
```

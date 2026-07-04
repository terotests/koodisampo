# Kontit tarvitsevat omat MAC-osoitteet LAN-segmentissä. Mikä driver?

## Tilanne

Useita palvelinkontteja pitää näkyä tehdas-LANissa erillisinä laitteina — kukin omalla MAC-osoitteellaan SNMP-monitorointia ja ACL-sääntöjä varten. Bridge-verkko NAT:aa kaiken hostin MAC:in alle.

```bash
docker run -d --name sensor1 --network bridge mysensor:latest
docker run -d --name sensor2 --network bridge mysensor:latest
# LAN näkee yhden MAC:in (host), ei kahta erillistä laitetta
```

## Ratkaisu

**macvlan tai ipvlan** antaa kontille oman MAC-osoitteen fyysisessä LAN-verkossa. IPvlan/Macvlan drivers — Docker docs macvlan.

macvlan (oma MAC per kontti):

```bash
docker network create -d macvlan \
  --subnet=192.168.50.0/24 \
  -o parent=eth0 \
  factory

docker run -d --name sensor1 --network factory mysensor:latest
docker run -d --name sensor2 --network factory mysensor:latest
```

ipvlan (MAC jaetaan parent-NIC:n kanssa, eri IP):

```bash
docker network create -d ipvlan \
  --subnet=192.168.50.0/24 \
  -o parent=eth0 \
  -o ipvlan_mode=l2 \
  factory_ipvl
```

## Käytännössä

Valitse macvlan kun laitteet vaativat erillisen MAC:in (legacy SNMP, ACL). ipvlan kun switchin MAC-taulu on täynnä tai MAC-osoitteita on rajattu. Testaa parent-NIC promiscuous mode -tuki pilviympäristössä ennen deployausta.

[Lue lisää](https://docs.docker.com/engine/network/drivers/macvlan/)

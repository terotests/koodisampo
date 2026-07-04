# Kontit samassa verkossa eivät pingaa toisiaan nimellä. Mitä diagnostiikkaa ajat?

## Tilanne

Kaksi testikonttia on samassa verkossa:

```bash
docker network create testnet
docker run -d --name alice --network testnet alpine sleep 3600
docker run -d --name bob --network testnet alpine sleep 3600
```

Bob-kontista:

```bash
docker exec bob ping alice
ping: bad address 'alice'
```

Verkko on luotu, kontit näkyvät käynnissä, mutta nimipohjainen yhteys epäonnistuu. Tarvit systemaattisen diagnostiikan erottamaan DNS-, verkko- ja liitostason ongelmat.

## Ratkaisu

Aja **`docker network inspect`** ja **`docker exec nslookup`** toiselle kontille. network inspect näyttää liitetyt kontit — embedded DNS testataan exec:llä.

```bash
docker network inspect testnet
docker exec bob nslookup alice
docker exec bob cat /etc/resolv.conf
```

Inspectista varmista, että molemmat kontit ovat `Containers`-osiossa. Jos kontti puuttuu, liitä verkko uudelleen. Jos nslookup epäonnistuu mutta kontti on listassa, tarkista ettei kyseessä ole default bridge (`bridge`) eikä eri verkko.

IP-pohjainen testi:

```bash
docker inspect alice --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
docker exec bob ping -c 1 <IP>
```

## Käytännössä

Monet minimal-kuvat (Alpine) eivät sisällä `nslookup` — asenna `bind-tools` tai käytä `getent hosts`. CI-putkessa embedda verkko-DNS-testi ennen integraatiotestejä; se säästää aikaa verrattuna IP-hardcodaukseen.

[Lue lisää](https://docs.docker.com/network/network-tutorial-standalone/)
